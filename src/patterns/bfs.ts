import { arr, combo, treeOf } from '@/lib/types'
import type { PatternIntro } from './index'

const NODES = [
  { id: 0, value: 1, left: 1, right: 2 },
  { id: 1, value: 2, left: 3, right: 4 },
  { id: 2, value: 3, left: null, right: 5 },
  { id: 3, value: 4, left: null, right: null },
  { id: 4, value: 5, left: null, right: null },
  { id: 5, value: 6, left: null, right: null },
]

export const bfs: PatternIntro = {
  id: 'bfs',
  name: 'Breadth-First Search',
  tagline: 'A queue turns "visit everything" into "visit ring by ring".',
  story: [
    'DFS dives; BFS spreads. Put the start in a queue, then repeat one move: take the *front*, visit it, and push its unvisited neighbours on the *back*. Because a queue is first-in first-out, everything at distance 1 is handled before anything at distance 2 — the search expands like rings on water.',
    "That ordering is the entire value. On a tree it means level-order: the queue's contents at any moment are one or two adjacent levels, and draining exactly the current queue length gives you one level at a time. On an unweighted graph it means the first time you reach a node is via a shortest path — no comparisons needed.",
    'The deepest version peels an entire graph like an onion: Kahn\'s algorithm starts the queue with every node that has no prerequisites, and removing a node unlocks its dependents into the queue. Course Schedule and Alien Dictionary are exactly this — BFS where "distance" is "how many things must come first".',
  ],
  signals: [
    'You need levels, layers, or generations — "process the tree floor by floor".',
    'Shortest path or fewest steps on an unweighted structure.',
    'Dependency order: things become ready when everything before them is done.',
    'DFS would work but you specifically care about *nearest first*.',
  ],
  pseudo: {
    lines: [
      'queue = [root]',
      'while queue not empty:',
      '    node = queue.pop_front()',
      '    visit node',
      '    push its children on the back',
    ],
    map: { init: 1, take: 3, visit: 4, push: 5 },
  },

  trace(t) {
    const visited: number[] = []
    let queue: number[] = [0]

    const view = (focus: number | null) =>
      combo(
        treeOf(NODES, 0, {
          tones: Object.fromEntries(
            NODES.map((n) => [
              n.id,
              visited.includes(n.id) ? 'done' : queue.includes(n.id) ? 'band' : 'idle',
            ]),
          ),
          pointers: focus != null ? [{ name: 'front', at: focus, accent: 'b' }] : [],
          title: 'level order — tinted nodes are waiting in the queue',
        }),
        arr(
          queue.map((id) => NODES[id].value),
          { showIndex: false, title: 'queue (front is leftmost)' },
        ),
      )

    t.push({
      step: 'init',
      note: 'The root enters the queue alone. From here the rule never changes: take from the front, push children on the back.',
      view: view(null),
      vars: [['queue', `[${queue.map((q) => NODES[q].value).join(', ')}]`]],
    })

    while (queue.length) {
      const id = queue[0]
      const node = NODES[id]
      t.bump()
      queue = queue.slice(1)
      visited.push(id)
      const kids = [node.left, node.right].filter((c): c is number => c != null)
      queue = [...queue, ...kids]
      t.push({
        step: kids.length ? 'push' : 'visit',
        note: kids.length
          ? `Visit ${node.value}; its ${kids.length === 2 ? 'children join' : 'child joins'} the back of the queue. Everything already waiting is closer and goes first.`
          : `Visit ${node.value} — a leaf, nothing to add. The queue keeps draining in distance order.`,
        view: view(id),
        vars: [
          ['visiting', node.value, 'b'],
          ['queue', `[${queue.map((q) => NODES[q].value).join(', ')}]`],
        ],
        badge: { text: `level ${id === 0 ? 0 : id <= 2 ? 1 : 2}`, accent: 'c' },
      })
    }

    t.push({
      step: 'visit',
      note: `Visited in order 1 2 3 4 5 6 — exactly the levels, top to bottom, left to right. The queue's discipline did all the ordering.`,
      view: view(null),
      vars: [['order', visited.map((v) => NODES[v].value).join(' '), 'ok']],
      badge: { text: 'rings complete', accent: 'ok' },
    })
  },

  ramp: ['binary-tree-level-order-traversal', 'course-schedule', 'alien-dictionary'],
}
