import { arr } from '@/lib/types'
import type { PatternIntro } from './index'

const NUMS = [3, 9, 14, 21, 27, 33, 37, 41, 52]
const TARGET = 37

export const binarySearch: PatternIntro = {
  id: 'binary-search',
  name: 'Binary Search',
  tagline: 'One question, half the candidates gone — repeat until one remains.',
  story: [
    'Linear search asks `n` questions. Binary search asks one question of the *middle* element and, because the array is sorted, the answer rules out an entire half. `n` becomes `n/2` becomes `n/4` — the whole search is over in `log n` probes. Ten probes handle a thousand elements; twenty handle a million.',
    "The interview versions are rarely the textbook lookup. The real skill is recognizing a *monotonic yes/no boundary* in disguise: an array that is sorted-then-rotated still has one sorted half at every probe (Search in Rotated Sorted Array), and \"where does the rotation start\" is just \"where does sorted become unsorted\" (Find Minimum). If you can phrase a question whose answers look like `no no no YES YES YES`, binary search finds the boundary.",
    'The two bugs that kill it every time: an off-by-one in how `lo`/`hi` shrink (always make the range strictly smaller), and probing a half that the sortedness proof does not actually cover. Watch the demo below with that in mind — every probe first proves which half is safe to discard.',
  ],
  signals: [
    'The input is sorted — or is sorted-with-a-twist (rotated, mountain, two sorted halves).',
    'You can answer "is it in the left half?" with one comparison.',
    'The problem asks for a boundary: first bad version, minimum in rotation, smallest x satisfying f(x).',
    'Constraints scream it: n up to 10^5+ with an expected O(log n) lookup.',
  ],
  pseudo: {
    lines: [
      'lo = 0, hi = n - 1',
      'while lo <= hi:',
      '    mid = (lo + hi) / 2',
      '    if nums[mid] == target: found it',
      '    if nums[mid] < target:  lo = mid + 1',
      '    else:                   hi = mid - 1',
    ],
    map: { init: 1, probe: 3, found: 4, right: 5, left: 6 },
  },

  trace(t) {
    let lo = 0
    let hi = NUMS.length - 1

    const view = (mid: number | null, tones: Record<number, 'dim' | 'good' | 'active'> = {}) =>
      arr(NUMS, {
        pointers: mid == null ? [] : [{ name: 'mid', at: mid, accent: 'c' }],
        band: lo <= hi ? { from: lo, to: hi, label: 'still possible' } : null,
        tones: {
          ...Object.fromEntries(NUMS.map((_, i) => [i, i < lo || i > hi ? 'dim' : 'idle'])),
          ...tones,
        },
        title: `sorted nums — find ${TARGET}`,
      })

    t.push({
      step: 'init',
      note: `${NUMS.length} candidates. A linear scan might need ${NUMS.length} looks; watch how few this takes.`,
      view: view(null),
      vars: [
        ['lo', lo, 'a'],
        ['hi', hi, 'b'],
        ['target', TARGET],
      ],
    })

    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      t.bump()
      if (NUMS[mid] === TARGET) {
        t.push({
          step: 'found',
          note: `nums[${mid}] = ${TARGET}. Found it — and every discarded element was discarded by proof.`,
          view: view(mid, { [mid]: 'good' }),
          vars: [
            ['mid', mid, 'c'],
            ['probes', t.frames.length, 'ok'],
          ],
          badge: { text: `found at index ${mid}`, accent: 'ok' },
        })
        return
      }
      if (NUMS[mid] < TARGET) {
        t.push({
          step: 'right',
          note: `nums[${mid}] = ${NUMS[mid]} < ${TARGET}. Everything at mid or left of it is even smaller — ${mid - lo + 1} elements gone in one comparison.`,
          view: view(mid, { [mid]: 'active' }),
          vars: [
            ['mid', mid, 'c'],
            ['nums[mid]', NUMS[mid], 'no'],
          ],
          badge: { text: `${NUMS[mid]} < ${TARGET} — go right`, accent: 'a' },
        })
        lo = mid + 1
      } else {
        t.push({
          step: 'left',
          note: `nums[${mid}] = ${NUMS[mid]} > ${TARGET}. Everything at mid or right of it is even bigger — ${hi - mid + 1} elements gone.`,
          view: view(mid, { [mid]: 'active' }),
          vars: [
            ['mid', mid, 'c'],
            ['nums[mid]', NUMS[mid], 'no'],
          ],
          badge: { text: `${NUMS[mid]} > ${TARGET} — go left`, accent: 'b' },
        })
        hi = mid - 1
      }
    }
  },

  ramp: ['find-minimum-in-rotated-sorted-array', 'search-in-rotated-sorted-array'],
}
