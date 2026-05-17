import type { RunIO } from './index'

// Compiler Explorer's public API — a real g++ with execution enabled.
// The browser cannot compile C++ itself, so this one call goes over the network.
const COMPILER = { id: 'g141', lang: 'c++', label: 'g++ 14.1' }

const ANSI = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g')
const stripAnsi = (s: string) => s.replace(ANSI, '')

const emit = (entries: { text: string }[] | undefined, out: (line: string) => void) =>
  (entries ?? []).forEach((e) => out(stripAnsi(e.text)))

export async function runCpp(source: string, io: RunIO): Promise<number> {
  io.system(`Compiling with ${COMPILER.label} on godbolt.org...`)

  let res: Response
  try {
    res = await fetch(`https://godbolt.org/api/compiler/${COMPILER.id}/compile`, {
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
  } catch {
    io.stderr('Could not reach the compile service (godbolt.org). Check your connection.')
    return 1
  }

  if (!res.ok) {
    io.stderr(`Compile service returned HTTP ${res.status}. Try again in a moment.`)
    return 1
  }

  const data = await res.json()
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
