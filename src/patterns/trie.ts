import { treeOf } from '@/lib/types'
import type { PatternIntro } from './index'

/**
 * Trie of "cat", "car", "dog", drawn with the binary tree renderer — every
 * node here happens to have at most two children, so the layout works.
 * ids: 0 root '·', 1 'c', 2 'd', 3 'a', 4 'o', 5 't', 6 'r', 7 'g'
 */
const NODES = [
  { id: 0, value: '·', left: 1, right: 2 },
  { id: 1, value: 'c', left: 3, right: null },
  { id: 2, value: 'd', left: 4, right: null },
  { id: 3, value: 'a', left: 5, right: 6 },
  { id: 4, value: 'o', left: 7, right: null },
  { id: 5, value: 't', left: null, right: null },
  { id: 6, value: 'r', left: null, right: null },
  { id: 7, value: 'g', left: null, right: null },
]

const WORDS: { word: string; path: number[]; adds: number[] }[] = [
  { word: 'cat', path: [0, 1, 3, 5], adds: [1, 3, 5] },
  { word: 'car', path: [0, 1, 3, 6], adds: [6] },
  { word: 'dog', path: [0, 2, 4, 7], adds: [2, 4, 7] },
]

export const trie: PatternIntro = {
  id: 'trie',
  name: 'Tries',
  tagline: 'Store words as paths, and shared prefixes are stored exactly once.',
  story: [
    'A trie takes "a set of words" and turns it into "a tree of letters": every word is a root-to-node path, one letter per step. The payoff is structural — words that share a prefix share a path. Insert `cat` and then `car`, and the second word costs one new node, because `c → a` already exists.',
    'That sharing is why prefix questions become trivial. "Any word starting with ca?" is just: walk c, walk a — if you did not fall off, the answer is yes. No scanning the whole dictionary; the walk costs the length of the prefix, not the size of the set. A boolean on each node marks "a word ends here", which is all that separates a full-word hit from a prefix hit.',
    'The heavier uses build on the walk: wildcards branch it (a `.` tries every child — Add and Search Word), and Word Search II walks the trie *while* walking the board, so the dictionary prunes the maze — the moment no dictionary path matches, the whole board branch dies.',
  ],
  signals: [
    'Many lookups against a fixed set of words — especially by prefix.',
    'The words "starts with", "autocomplete", or "dictionary" appear.',
    'Wildcard or pattern matching against a word set, letter by letter.',
    'A search over a board or string keeps re-checking the same word beginnings.',
  ],
  pseudo: {
    lines: [
      'insert(word):',
      '    node = root',
      '    for ch in word:',
      '        create child if missing',
      '        step into it',
      '    mark node as a word-end',
    ],
    map: { init: 2, create: 4, step: 5, end: 6 },
  },

  trace(t) {
    const present = new Set<number>([0])
    const ends = new Set<number>()

    const view = (focus: number | null) =>
      treeOf(
        NODES.filter((n) => present.has(n.id)).map((n) => ({
          ...n,
          left: n.left != null && present.has(n.left) ? n.left : null,
          right: n.right != null && present.has(n.right) ? n.right : null,
        })),
        0,
        {
          tones: Object.fromEntries(
            [...present].map((id) => [id, ends.has(id) ? 'good' : 'band']),
          ),
          pointers: focus != null ? [{ name: 'at', at: focus, accent: 'b' }] : [],
          title: 'the trie — green nodes end a word',
        },
      )

    t.push({
      step: 'init',
      note: 'An empty trie: just a root. Each inserted word will carve a path of letters downward.',
      view: view(0),
      vars: [],
    })

    for (const { word, path, adds } of WORDS) {
      for (let d = 1; d < path.length; d++) {
        const id = path[d]
        const isNew = !present.has(id)
        present.add(id)
        t.bump()
        if (d === path.length - 1) ends.add(id)
        t.push({
          step: isNew ? 'create' : 'step',
          note: isNew
            ? `'${word}': letter '${NODES[id].value}' has no node yet — create it. ${adds.length < word.length ? `The shared prefix cost nothing new.` : ''}`
            : `'${word}': '${NODES[id].value}' already exists from an earlier word — walk into it for free. Shared prefixes are stored once.`,
          view: view(id),
          vars: [
            ['word', word, 'a'],
            ['letter', NODES[id].value as string, 'b'],
          ],
          badge:
            d === path.length - 1
              ? { text: `"${word}" stored`, accent: 'ok' }
              : isNew
                ? { text: `+ ${NODES[id].value}`, accent: 'c' }
                : { text: `reuse ${NODES[id].value}`, accent: 'mute' },
        })
      }
    }

    t.push({
      step: 'end',
      note: `Three words, ${present.size - 1} letter nodes — 'cat' and 'car' share two of them. "Starts with ca?" is now a two-step walk, no matter how many words are stored.`,
      view: view(null),
      vars: [['words', 'cat car dog', 'ok']],
      badge: { text: 'prefixes shared', accent: 'ok' },
    })
  },

  ramp: ['implement-trie-prefix-tree', 'add-and-search-word', 'word-search-ii'],
}
