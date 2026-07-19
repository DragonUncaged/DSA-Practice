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
checks only its tests; `_fixture-practice-only.ts` is the template. A problem that also omits
`signature` (and so `tests`, `demo`, `starter`, `solutions`) is statement-only — `hasPractice`
decides, and the player shows the statement with no editor; use it only for a class, iterator or
callback API no single `ParamType` function can express. Practice compiles C++ on
godbolt.org, so Run tests needs network for that language; JavaScript runs in a local Web Worker.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
