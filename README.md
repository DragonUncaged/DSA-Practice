# TRACE

Visual DSA practice for the Blind 75. Every problem runs as a stepped animation
beside the code that produced it, and you can write your own solution against
the same tests without leaving the page.

Static Next.js app. No database, no accounts, no backend. All progress lives in
`localStorage`. Deploys to Vercel as-is.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## What's in it

Three tabs per problem:

| Tab | What it does |
|---|---|
| **Trace** | Stepped animation with code sync, live variable state, scrub bar, speed control. `space` plays, `←`/`→` step. |
| **Brute vs Optimal** | Both solutions animate on the same input at the same time. The optimal one finishes while the brute force is still grinding. |
| **Practice** | Monaco editor, your solution run against the real test table in Python, C++ or JavaScript. Passing every case marks the problem solved. |

All 75 problems are traced. `/selftest` runs every trace and every reference
solution against its own test table and reports anything broken.

Before the problems, `/patterns` teaches the moves: 14 pattern intros (hashing,
two pointers, sliding window, stack, binary search, DFS on trees, BFS, graphs,
backtracking, DP, intervals, heaps, tries, bits), each with a toy demo animated
through the same trace engine, "reach for it when" signals, and a recommended
ramp through the sheet's problems. Problem pages link back to their pattern.

The player layout is adjustable: drag the transport bar to trade animation
space for solution space, and drag the divider in Practice to resize the
test-case panel. Double-click either handle to reset. Both persist.

## How code actually runs

| Language | Where |
|---|---|
| JavaScript | Sandboxed Web Worker in the tab, with an 8s kill switch for infinite loops |
| Python | CPython compiled to WebAssembly (Pyodide), ~10 MB on first run, then cached |
| C++ | Compiled and executed by [Compiler Explorer](https://godbolt.org)'s public API |

The C++ path is the only runtime network dependency, and only when you press Run
on C++.

## Architecture

The thing that makes 75 problems tractable is that **traces are not hand-drawn
animations**. A solution is written once with `t.push(...)` calls in it; running
it produces an array of frames, and each frame is a complete snapshot of the
algorithm's state. That is why stepping backwards works for free and why the
scrub bar can jump anywhere.

Roughly eight generic renderers cover everything: array, bars, string, grid,
linked list, tree, stack, hash map. Adding a problem means writing a solution,
not writing drawing code.

```
src/
  lib/
    types.ts        the trace model - Frame, View, Tracer, and the view builders
    harness.ts      turns a signature + test table into runnable JS/Python/C++
    complexity.ts   growth measurement, used by /selftest only
    store.ts        Zustand store persisted to localStorage
    useTrace.ts     playback (index, play/pause, speed, keyboard)
  viz/              one renderer per View.kind, plus the shared tone palette
  problems/         one file per problem; index.ts holds the full Blind 75 sheet
  runners/          runJS (worker), runPython (Pyodide), runCpp (godbolt)
  components/       Player, ProblemSwitcher, CompareView, Practice, Sheet, Home
  styles/           _vars.scss and _mix.scss; everything else is *.module.scss
```

## Adding a problem

Create `src/problems/<slug>.ts` and export a `Problem`. The slug must match the
kebab-cased title so it links itself into the sheet automatically. Then add it
to `PROBLEMS` in `src/problems/index.ts`.

A problem needs:

- **`signature`** — drives the generated test harness in all three languages.
  Supported types include `int`, `string`, `int[]`, `char[][]`, `list`, `tree`.
- **`tests`** — one table, used by every language. Make sure each case has
  exactly one valid answer unless you set `compare: 'set' | 'sorted'`.
- **`demo`** — the arguments the animation runs on. Keep it small: 6–10 elements
  reads well, 30 does not.
- **`solutions`** — index 0 is shown by default. Adding a second entry with
  `kind: 'brute'` unlocks the Brute vs Optimal tab.
- **`scale(n)`** — input generator used by `/selftest` to check the solution's
  real growth against its claimed Big-O. Make it the *worst case*, or a
  quadratic will measure as linear and the check will pass when it should not.

Each solution carries `code` per language as `{ lines, map }`, where `map` sends
a semantic step key to a 1-based line number. One trace then lights up the
correct line in Python, C++ and JavaScript without being rewritten three times.

```ts
trace(t, [nums, target]) {
  t.push({
    step: 'read',                       // -> code.map.read, per language
    note: 'Plain-English explanation of this exact step.',
    view: arr(nums, {
      tones: { 0: 'done', 1: 'active' },
      pointers: [{ name: 'i', at: 1, accent: 'a' }],
    }),
    vars: [['i', 1, 'a'], ['need', 7, 'c']],
    badge: { text: 'need 7', accent: 'c' },
  })
}
```

Run `/selftest` after adding one. It checks that the trace produces frames, that
every step key maps to a real line in all three languages, that the reference
solution passes its own tests, and that its measured growth is readable.

## Design notes

Near-black surfaces, one lime accent, coral and sky for the two-pointer pair.
Tones (`idle`, `dim`, `band`, `active`, `good`, `bad`, `done`, `accent`) mean the
same thing in every renderer, so `active` reads identically on an array and on a
tree.

Solved status is never a checkbox. The only thing that writes it is the Practice
runner, after every test case passes, so a green row on the sheet always means
the code ran. Solutions ship fogged and are earned back a line at a time by
watching the trace execute them; a full reveal is remembered, which is what the
clean-solve diamond keys off.
