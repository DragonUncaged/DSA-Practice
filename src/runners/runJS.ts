import type { RunIO } from './index'

const TIMEOUT_MS = 8000

/**
 * Output caps. A loop that prints is as common a mistake as a loop that
 * spins, and one `postMessage` per `console.log` floods the main thread long
 * before the 8 s kill switch fires. The worker batches instead, and stops
 * forwarding entirely past the cap: the program keeps running to its timeout,
 * but the tab stays usable.
 */
const MAX_LINES = 5000
const MAX_BYTES = 256 * 1024
const FLUSH_MS = 50
const FLUSH_LINES = 200
const TRUNCATED = `Output truncated after ${MAX_LINES.toLocaleString('en-US')} lines.`

interface Batched {
  type: 'batch'
  items: { type: 'stdout' | 'stderr'; text: string }[]
}

/**
 * Runs user JavaScript inside a Web Worker. The worker gives us two things a
 * plain eval can't: console output we can intercept cleanly, and a hard kill
 * for an infinite loop, which learners write constantly.
 */
export function runJavaScript(source: string, io: RunIO): Promise<number> {
  const harness = `
    "use strict";
    const __MAX_LINES = ${MAX_LINES}, __MAX_BYTES = ${MAX_BYTES};
    const __FLUSH_MS = ${FLUSH_MS}, __FLUSH_LINES = ${FLUSH_LINES};
    let __queue = [], __seen = 0, __bytes = 0, __capped = false, __timer = null;
    const __flush = () => {
      if (__timer !== null) { clearTimeout(__timer); __timer = null; }
      if (!__queue.length) return;
      const items = __queue;
      __queue = [];
      postMessage({ type: "batch", items });
    };
    // A tight printing loop never yields, so the timer alone would never fire:
    // the line count is what actually bounds a batch in that case.
    const __emit = (type, text) => {
      if (__capped) return;
      __seen++; __bytes += text.length;
      if (__seen > __MAX_LINES || __bytes > __MAX_BYTES) {
        __capped = true;
        __queue.push({ type: "stderr", text: ${JSON.stringify(TRUNCATED)} });
        __flush();
        return;
      }
      __queue.push({ type, text });
      if (__queue.length >= __FLUSH_LINES) __flush();
      else if (__timer === null) __timer = setTimeout(__flush, __FLUSH_MS);
    };
    const __fmt = (args) => args.map((a) => {
      if (typeof a === "string") return a;
      if (a instanceof Error) return a.stack || String(a);
      try { return JSON.stringify(a) ?? String(a); } catch { return String(a); }
    }).join(" ");
    ["log", "info", "debug"].forEach((m) => {
      console[m] = (...args) => __emit("stdout", __fmt(args));
    });
    ["warn", "error"].forEach((m) => {
      console[m] = (...args) => __emit("stderr", __fmt(args));
    });
    (async () => {
      try {
        await eval(${JSON.stringify(source)});
        __flush();
        postMessage({ type: "done", code: 0 });
      } catch (e) {
        __emit("stderr", (e && e.stack) ? e.stack : String(e));
        __flush();
        postMessage({ type: "done", code: 1 });
      }
    })();
  `

  const url = URL.createObjectURL(new Blob([harness], { type: 'application/javascript' }))
  const worker = new Worker(url)

  return new Promise<number>((resolve) => {
    let finished = false
    const finish = (code: number) => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve(code)
    }

    const timer = setTimeout(() => {
      io.stderr(`Stopped: exceeded the ${TIMEOUT_MS / 1000}s time limit. Check for an infinite loop.`)
      finish(137)
    }, TIMEOUT_MS)

    const write = (type: string, text: string) => {
      if (type === 'stdout') io.stdout(text)
      else io.stderr(text)
    }

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data as { type: string; text?: string; code?: number } & Partial<Batched>
      if (msg.type === 'batch') (msg.items ?? []).forEach((m) => write(m.type, m.text))
      else if (msg.type === 'stdout') io.stdout(msg.text ?? '')
      else if (msg.type === 'stderr') io.stderr(msg.text ?? '')
      else if (msg.type === 'done') finish(msg.code ?? 0)
    }
    worker.onerror = (e) => {
      io.stderr(e.message || 'Uncaught error')
      finish(1)
    }
  })
}
