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

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
