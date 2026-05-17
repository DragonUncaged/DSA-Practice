import type { RunIO } from './index'

const PYODIDE_VERSION = 'v0.28.3'
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodidePromise: Promise<any> | null = null
let ready = false

export const isPythonReady = () => ready

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script')
    el.src = src
    el.onload = () => resolve()
    el.onerror = () => reject(new Error(`failed to load ${src}`))
    document.head.appendChild(el)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPyodide(io: RunIO): Promise<any> {
  if (pyodidePromise) return pyodidePromise

  io.system('Downloading the Python runtime (Pyodide, ~10 MB). This happens once.')
  pyodidePromise = (async () => {
    // Monaco installs a global AMD loader. Pyodide's bundled UMD dependencies
    // would resolve through it and try to fetch from our own origin, so hide
    // the `amd` flag for the duration of the load.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = window as any
    const amdFlag = g.define?.amd
    if (g.define) g.define.amd = undefined
    try {
      if (!window.loadPyodide) await loadScript(`${PYODIDE_BASE}pyodide.js`)
      const py = await window.loadPyodide!({ indexURL: PYODIDE_BASE })
      ready = true
      io.system(`Python ${py.runPython('import sys; sys.version.split()[0]')} ready.`)
      return py
    } finally {
      if (g.define && amdFlag) g.define.amd = amdFlag
    }
  })()

  // allow a retry after a network failure
  pyodidePromise.catch(() => {
    pyodidePromise = null
  })
  return pyodidePromise
}

export async function runPython(source: string, io: RunIO): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let py: any
  try {
    py = await getPyodide(io)
  } catch {
    io.stderr('Could not download the Python runtime. Check your connection and try again.')
    return 1
  }

  py.setStdout({ batched: (text: string) => io.stdout(text) })
  py.setStderr({ batched: (text: string) => io.stderr(text) })

  try {
    await py.runPythonAsync(source)
    return 0
  } catch (e) {
    // strip Pyodide's own frames so the traceback points at the learner's code
    const msg = String((e as Error)?.message ?? e)
      .split('\n')
      .filter((line) => !line.includes('pyodide/') && !line.includes('_pyodide/'))
      .join('\n')
      .trim()
    io.stderr(msg)
    return 1
  } finally {
    py.setStdout({})
    py.setStderr({})
  }
}
