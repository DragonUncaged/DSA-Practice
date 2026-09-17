import type { RunIO } from './index'

// Compiler Explorer's public API — a real g++ with execution enabled.
// The browser cannot compile C++ itself, so this one call goes over the network.
const COMPILER = { id: 'g141', lang: 'c++', label: 'g++ 14.1' }

const ANSI = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g')
const stripAnsi = (s: string) => s.replace(ANSI, '')

const emit = (entries: { text: string }[] | undefined, out: (line: string) => void) =>
  (entries ?? []).forEach((e) => out(stripAnsi(e.text)))

/** Long enough for a cold compiler, short enough that a hung request ends. */
const TIMEOUT_MS = 30_000

export async function runCpp(source: string, io: RunIO): Promise<number> {
  io.system(`Compiling with ${COMPILER.label} on godbolt.org...`)

  // One request does compile + run, so everything that can go wrong with the
  // network is handled in one place: a timeout, an unreachable host, a body
  // that is not the JSON we asked for.
  let data: {
    buildResult?: { code?: number; stderr?: { text: string }[] }
    timedOut?: boolean
    stdout?: { text: string }[]
    stderr?: { text: string }[]
    code?: number
  }
  try {
    const res = await fetch(`https://godbolt.org/api/compiler/${COMPILER.id}/compile`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source,
        lang: COMPILER.lang,
        allowStoreCodeDebug: false,
        options: {
          userArguments: '-O2 -std=c++20',
          executeParameters: { args: [], stdin: '' },
          compilerOptions: { executorRequest: true },
          filters: { execute: true },
          tools: [],
          libraries: [],
        },
      }),
    })

    if (res.status === 404) {
      // The compiler id is pinned; if Compiler Explorer retires it, "try
      // again" is the wrong advice — nothing about waiting will help.
      io.stderr(`Compiler unavailable: godbolt.org no longer offers ${COMPILER.label} (${COMPILER.id}).`)
      return 1
    }
    if (!res.ok) {
      io.stderr(`Compile service returned HTTP ${res.status}. Try again in a moment.`)
      return 1
    }

    try {
      data = await res.json()
    } catch {
      io.stderr('The compile service returned a response we could not read. Try again in a moment.')
      return 1
    }
  } catch (e) {
    if ((e as Error)?.name === 'TimeoutError') {
      io.stderr(`The compile service did not respond within ${TIMEOUT_MS / 1000}s. Try again in a moment.`)
    } else {
      io.stderr('Could not reach the compile service (godbolt.org). Check your connection.')
    }
    return 1
  }

  const build = data.buildResult

  if (build && build.code !== 0) {
    io.system(`${COMPILER.label} could not compile this:`)
    emit(build.stderr, io.stderr)
    return build.code || 1
  }
  if (build) emit(build.stderr, io.system) // warnings

  if (data.timedOut) {
    io.stderr('Stopped: execution timed out.')
    return 137
  }

  emit(data.stdout, io.stdout)
  emit(data.stderr, io.stderr)
  return typeof data.code === 'number' ? data.code : 0
}
