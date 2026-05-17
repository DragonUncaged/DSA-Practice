import type { Lang } from '@/lib/types'
import { runCpp } from './runCpp'
import { runJavaScript } from './runJS'
import { runPython } from './runPython'

export interface RunIO {
  /** program stdout, one line at a time */
  stdout: (text: string) => void
  /** program stderr / runtime errors */
  stderr: (text: string) => void
  /** runner status: loading an interpreter, compiling, and so on */
  system: (text: string) => void
}

export interface RunResult {
  exitCode: number
  durationMs: number
}

export const LANG_NOTE: Record<Lang, string> = {
  js: 'Runs in a sandboxed Web Worker in this tab.',
  py: 'Runs on CPython compiled to WebAssembly (Pyodide). First run downloads ~10 MB.',
  cpp: 'Compiled and executed remotely by Compiler Explorer (godbolt.org).',
}

export async function runCode(lang: Lang, source: string, io: RunIO): Promise<RunResult> {
  const started = performance.now()
  let exitCode = 0
  try {
    if (lang === 'js') exitCode = await runJavaScript(source, io)
    else if (lang === 'py') exitCode = await runPython(source, io)
    else exitCode = await runCpp(source, io)
  } catch (e) {
    io.stderr(String((e as Error)?.message ?? e))
    exitCode = 1
  }
  return { exitCode, durationMs: Math.round(performance.now() - started) }
}
