<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Tracks

A track is a problem list rendered by the shared `src/components/Sheet.tsx`. Adding one means a data
module under `src/problems/`, an entry in Sheet's `TRACKS` map, a route that renders `<Sheet track=…/>`,
and a `TopNav` link — see `src/problems/companies.ts` and `src/app/company/google/page.tsx` for the
smallest complete example. Never fork `Sheet`; search, filters, progress and collapsible groups all
live there. Progress is keyed by `problemId ?? slug`, so the same problem shares state across tracks.
A row without a trace is not dead: it opens on LeetCode, using `SheetEntry.leetcode` when the track
knows the real slug (see `src/problems/premium.ts`) and otherwise the slugified title, which is
best-effort and misses for titles we spell differently.

## Problems

A problem is one file under `src/problems/` exporting a `Problem` (type in `src/lib/types.ts`),
registered in `src/problems/index.ts`; `src/problems/3sum.ts` is the smallest complete template. A
whole track registers through one per-track array instead, so parallel work rebases cleanly — see
`src/problems/premium-index.ts`, spread into `PROBLEMS`. A
sheet row goes live when a registered id equals the row's slugified title (or its explicit id). Write a
solution and step map for every `Lang`, then serve a build and open `/selftest`: it checks frames,
unmapped steps and the reference solution against its own tests. A problem whose solutions omit
`trace` and `code[lang].map` is practice-only — `hasTrace` in `src/problems/index.ts` decides, the
player hides Trace and Brute vs Optimal and opens on Practice, and `/selftest` labels the row and
checks only its tests; `src/problems/plus-one.ts` is the smallest one. A problem with no trace shows
its `solutions` under a Solutions tab in array order, so list its rungs `brute`, `better`, `optimal`
(traced problems keep the optimal at index 0); a `brute` reference `run` may throw an error
containing `too slow` on an input it cannot finish, and `/selftest` counts that as a pass.
A problem carrying `design` instead of `signature` is a design problem: the runner builds a class
and dispatches method calls on it, driven by `designTests` (LeetCode's `ops`/`args`/`expect` call
log) with a class skeleton for `starter` — see `src/problems/moving-average-from-data-stream.ts`,
whose reference `run` takes `[ops, args]` and returns that case's result list. The generated C++
driver passes constructor arguments as temporaries, so a design class takes them by value or
`const&`, never `vector<T>&`. An API neither shape can express (a NestedInteger, an N-ary tree, a
hidden Robot, a circular list) still gets tests as a function problem: the starter carries the
provided scaffold plus a wrapper the tests call, and the statement says so — see
`src/problems/nested-list-weight-sum.ts` and `src/problems/robot-room-cleaner.ts`.
A problem with neither is statement-only — `hasPractice` decides, and the player shows the statement
with no editor; use it only when even that wrapper shape cannot express the API.
Practice compiles C++ on
godbolt.org, so Run tests needs network for that language; JavaScript runs in a local Web Worker.

## Routes

`src/app/layout.tsx` owns the one `<main>` landmark for every route, so a page must never add its
own. An unknown id belongs in a segment `not-found.tsx` reached by `notFound()` from the page, not
in a 200 rendered by the client component. `src/app/error.tsx` and `src/app/p/[id]/error.tsx` catch
route crashes; a renderer that throws is caught closer, by `VizBoundary` in `PlayerParts.tsx`, so the
header and switcher survive. Text colours must clear 4.5:1 on the app surfaces - the ramp in
`src/styles/_vars.scss` says which tokens are safe.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
