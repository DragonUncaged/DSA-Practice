import { arr, combo, stackOf } from '@/lib/types'
import type { PatternIntro } from './index'

const STREAM = [7, 2, 9, 4, 11, 3, 8]
const K = 3

export const heap: PatternIntro = {
  id: 'heap',
  name: 'Heaps & Top-K',
  tagline: 'Keep only the k best; let the worst of them guard the door.',
  story: [
    'Sorting everything to take the best three is paying for order you will throw away. A heap keeps just enough order: it can always hand you its *smallest* element in O(1) and fix itself in O(log k) after a change. That single ability is the whole trick.',
    'To track the top `k` of a stream, keep a min-heap of size `k` — yes, *min*: the weakest of your current champions sits on top, guarding the door. Each newcomer fights only the guard. Lose, and the newcomer is smaller than all k champions — discard it in O(1). Win, and it replaces the guard in O(log k). You never compare against the other champions at all.',
    'That inversion — min-heap for top-k, max-heap for bottom-k — is the part worth internalizing. The ramp stretches it further: Merge K Lists keeps a heap of k list-heads ("who is smallest right now?"), and Find Median balances *two* heaps against each other, the max-heap of the lower half staring at the min-heap of the upper half.',
  ],
  signals: [
    'The words "k largest", "k most frequent", "k closest" — with k much smaller than n.',
    'A running best-so-far over a stream you see once.',
    'Repeatedly need the min or max of a changing collection — not full sorted order.',
    'Merging many sorted sources: the heap picks the next element among the fronts.',
  ],
  pseudo: {
    lines: [
      'heap = first k elements (min-heap)',
      'for x in the rest:',
      '    if x <= heap.min: discard x',
      '    else: pop min, push x',
      'heap now holds the top k',
    ],
    map: { init: 1, skip: 3, evict: 4, done: 5 },
  },

  trace(t) {
    let heapArr: number[] = []

    const heapView = () => stackOf([...heapArr].sort((a, b) => b - a), {
      tones: { 0: 'active' },
      title: 'min-heap — the guard sits on top',
      flip: true,
    })

    const view = (i: number | null) =>
      combo(
        arr(STREAM, {
          pointers: i == null ? [] : [{ name: 'x', at: i, accent: 'a' }],
          tones: Object.fromEntries(STREAM.map((_, j) => [j, i != null && j < i ? 'done' : 'idle'])),
          title: `the stream — keep the top ${K}`,
        }),
        heapView(),
      )

    for (let i = 0; i < K; i++) {
      heapArr.push(STREAM[i])
      t.bump()
    }
    t.push({
      step: 'init',
      note: `The first ${K} enter free of charge. The smallest of them — ${Math.min(...heapArr)} — becomes the guard at the door.`,
      view: view(K - 1),
      vars: [['guard', Math.min(...heapArr), 'b']],
    })

    for (let i = K; i < STREAM.length; i++) {
      const x = STREAM[i]
      const guard = Math.min(...heapArr)
      t.bump()
      if (x <= guard) {
        t.push({
          step: 'skip',
          note: `${x} loses to the guard ${guard} — so ${x} is smaller than all ${K} champions. One comparison, discarded.`,
          view: view(i),
          vars: [
            ['x', x, 'a'],
            ['guard', guard, 'b'],
          ],
          badge: { text: `${x} ≤ ${guard} — out`, accent: 'mute' },
        })
      } else {
        heapArr = [...heapArr.filter((v) => v !== guard), x]
        t.push({
          step: 'evict',
          note: `${x} beats the guard ${guard}: the guard is evicted, ${x} joins, and ${Math.min(...heapArr)} takes over guard duty. O(log k), and the other champions never got involved.`,
          view: view(i),
          vars: [
            ['x', x, 'a'],
            ['evicted', guard, 'no'],
            ['new guard', Math.min(...heapArr), 'b'],
          ],
          badge: { text: `${guard} out, ${x} in`, accent: 'ok' },
        })
      }
    }

    t.push({
      step: 'done',
      note: `Top ${K} of the stream: ${[...heapArr].sort((a, b) => b - a).join(', ')} — found in one pass, O(n log k), without sorting the other ${STREAM.length - K} elements.`,
      view: view(null),
      vars: [['top k', [...heapArr].sort((a, b) => b - a).join(' '), 'ok']],
      badge: { text: 'top k held', accent: 'ok' },
    })
  },

  ramp: ['top-k-frequent-elements', 'merge-k-sorted-lists', 'find-median-from-data-stream'],
}
