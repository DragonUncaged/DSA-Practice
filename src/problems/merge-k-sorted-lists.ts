import { arr, combo, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[][]] = [[[1, 4, 5], [1, 3, 4], [2, 6]]]

export const mergeKSortedLists: Problem = {
  id: 'merge-k-sorted-lists',
  title: 'Merge K Sorted Lists',
  group: 'Linked List',
  pattern: 'Pairwise Merge',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/merge-k-sorted-lists/',
  statement:
    'You are given an array of `k` sorted linked lists. Merge them all into one sorted list and return it.',
  constraints: ['0 <= k <= 10^4', '0 <= total nodes <= 10^4', 'Each list is sorted ascending'],
  signature: { fn: 'mergeKLists', params: [{ name: 'lists', type: 'list[]' }], ret: 'list' },
  tests: [
    { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expect: [1, 1, 2, 3, 4, 4, 5, 6] },
    { args: [[]], expect: [], note: 'no lists at all' },
    { args: [[[]]], expect: [], note: 'one empty list' },
    { args: [[[2], [1]]], expect: [1, 2] },
  ],
  demo: DEMO,
  scale: (n) => {
    const k = 8
    const per = Math.max(1, Math.floor(n / k))
    return [Array.from({ length: k }, (_, i) => Array.from({ length: per }, (_, j) => j * k + i))]
  },
  starter: {
    js: `function mergeKLists(lists) {
  // lists: (ListNode | null)[]  ->  ListNode | null
}
`,
    cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'pairwise',
      label: 'Merge in pairs, tournament style',
      kind: 'optimal',
      time: 'O(N log k)',
      space: 'O(1)',
      blurb:
        'Merging lists one-into-one runs the first list through every merge — O(Nk). Instead merge them in pairs: k lists become k/2, then k/4, and every node participates in only log k merges. Same two-list merge underneath, smarter schedule on top.',
      code: {
        cpp: {
          lines: [
            'ListNode* mergeKLists(vector<ListNode*>& lists) {',
            '    if (lists.empty()) return nullptr;',
            '    auto merge2 = [](ListNode* a, ListNode* b) {',
            '        ListNode dummy, *tail = &dummy;',
            '        while (a && b) {',
            '            if (a->val <= b->val) { tail->next = a; a = a->next; }',
            '            else { tail->next = b; b = b->next; }',
            '            tail = tail->next;',
            '        }',
            '        tail->next = a ? a : b;',
            '        return dummy.next;',
            '    };',
            '    while (lists.size() > 1) {',
            '        vector<ListNode*> merged;',
            '        for (int i = 0; i < lists.size(); i += 2) {',
            '            ListNode* b = i + 1 < lists.size() ? lists[i + 1] : nullptr;',
            '            merged.push_back(merge2(lists[i], b));',
            '        }',
            '        lists = merged;',
            '    }',
            '    return lists[0];',
            '}',
          ],
          map: { init: 2, pair: 17, round: 19, done: 21 },
        },
        js: {
          lines: [
            'function mergeKLists(lists) {',
            '  if (lists.length === 0) return null;',
            '  const merge2 = (a, b) => {',
            '    const dummy = new ListNode();',
            '    let tail = dummy;',
            '    while (a && b) {',
            '      if (a.val <= b.val) { tail.next = a; a = a.next; }',
            '      else { tail.next = b; b = b.next; }',
            '      tail = tail.next;',
            '    }',
            '    tail.next = a ?? b;',
            '    return dummy.next;',
            '  };',
            '  while (lists.length > 1) {',
            '    const merged = [];',
            '    for (let i = 0; i < lists.length; i += 2) {',
            '      merged.push(merge2(lists[i], lists[i + 1] ?? null));',
            '    }',
            '    lists = merged;',
            '  }',
            '  return lists[0];',
            '}',
          ],
          map: { init: 2, pair: 17, round: 19, done: 21 },
        },
      },

      trace(t, [input]: [number[][]]) {
        let lists = input.map((a) => [...a])

        const view = (hot: number[], tone: Tone) => {
          const rows = lists.map((a, i) =>
            arr(a.length ? a : ['—'], {
              tones: Object.fromEntries(a.map((_, k) => [k, hot.includes(i) ? tone : ('band' as Tone)])),
              title: `list ${i}`,
              showIndex: false,
            }),
          )
          return combo(...rows)
        }

        if (lists.length === 0) {
          t.push({
            step: 'init',
            note: 'No lists — nothing to merge.',
            view: arr(['—'], { title: 'lists' }),
            vars: [['answer', 'null', 'no']],
          })
          return
        }

        t.push({
          step: 'init',
          note: `${lists.length} sorted lists. Merging them pairwise means each element passes through only log₂(${lists.length}) ≈ ${Math.ceil(Math.log2(Math.max(2, lists.length)))} merges, not ${lists.length - 1}.`,
          view: view([], 'band'),
          vars: [['lists', lists.length]],
        })

        const merge2 = (a: number[], b: number[]): number[] => {
          const out: number[] = []
          let i = 0
          let j = 0
          while (i < a.length && j < b.length) {
            t.bump()
            if (a[i] <= b[j]) out.push(a[i++])
            else out.push(b[j++])
          }
          while (i < a.length) out.push(a[i++])
          while (j < b.length) out.push(b[j++])
          return out
        }

        let round = 0
        while (lists.length > 1 && !t.full) {
          round++
          const merged: number[][] = []
          for (let i = 0; i < lists.length; i += 2) {
            if (i + 1 < lists.length) {
              const result = merge2(lists[i], lists[i + 1])
              t.push({
                step: 'pair',
                note: `Round ${round}: merge list ${i} [${lists[i].join(', ')}] with list ${i + 1} [${lists[i + 1].join(', ')}] → [${result.join(', ')}].`,
                view: view([i, i + 1], 'active'),
                vars: [
                  ['pair', `${i} + ${i + 1}`, 'c'],
                  ['result', `[${result.join(', ')}]`, 'ok'],
                ],
                badge: { text: `merge ${i} & ${i + 1}`, accent: 'c' },
              })
              merged.push(result)
            } else {
              merged.push(lists[i])
            }
          }
          lists = merged
          t.push({
            step: 'round',
            note: `Round ${round} complete: ${lists.length} list${lists.length === 1 ? '' : 's'} remain.`,
            view: view([], 'band'),
            vars: [
              ['round', round],
              ['lists left', lists.length, 'c'],
            ],
            badge: { text: `${lists.length} left`, accent: 'c' },
          })
        }

        t.push({
          step: 'done',
          note: `One list stands: [${lists[0].join(', ')}]. ${round} rounds of pairwise merging — the log k in O(N log k).`,
          view: view([0], 'good'),
          vars: [['answer', `[${lists[0].join(', ')}]`, 'ok']],
          badge: { text: 'merged', accent: 'ok' },
        })
      },

      run([input]: [number[][]], c) {
        let lists = input.map((a) => [...a])
        if (lists.length === 0) return []
        const merge2 = (a: number[], b: number[]): number[] => {
          const out: number[] = []
          let i = 0
          let j = 0
          while (i < a.length && j < b.length) {
            c.ops++
            if (a[i] <= b[j]) out.push(a[i++])
            else out.push(b[j++])
          }
          while (i < a.length) {
            c.ops++
            out.push(a[i++])
          }
          while (j < b.length) {
            c.ops++
            out.push(b[j++])
          }
          return out
        }
        while (lists.length > 1) {
          const merged: number[][] = []
          for (let i = 0; i < lists.length; i += 2) {
            merged.push(i + 1 < lists.length ? merge2(lists[i], lists[i + 1]) : lists[i])
          }
          lists = merged
        }
        return lists[0]
      },
    },
  ],
}
