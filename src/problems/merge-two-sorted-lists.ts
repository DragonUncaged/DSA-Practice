import { arr, combo, type Problem, type Tone } from '@/lib/types'

const DEMO: [number[], number[]] = [[1, 2, 4], [1, 3, 4, 6]]

export const mergeTwoSortedLists: Problem = {
  id: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  group: 'Linked List',
  pattern: 'Two Pointers',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/merge-two-sorted-lists/',
  statement:
    'Merge two sorted linked lists `list1` and `list2` into one sorted list by splicing their nodes together, and return its head.',
  constraints: ['0 <= nodes in each list <= 50', 'Both lists are sorted ascending'],
  signature: {
    fn: 'mergeTwoLists',
    params: [
      { name: 'list1', type: 'list' },
      { name: 'list2', type: 'list' },
    ],
    ret: 'list',
  },
  tests: [
    { args: [[1, 2, 4], [1, 3, 4]], expect: [1, 1, 2, 3, 4, 4] },
    { args: [[], []], expect: [], note: 'both empty' },
    { args: [[], [0]], expect: [0] },
    { args: [[5], [1, 2, 3]], expect: [1, 2, 3, 5] },
  ],
  demo: DEMO,
  scale: (n) => [
    Array.from({ length: Math.floor(n / 2) }, (_, i) => i * 2),
    Array.from({ length: Math.ceil(n / 2) }, (_, i) => i * 2 + 1),
  ],
  starter: {
    py: `def mergeTwoLists(list1, list2):
    # list1, list2: ListNode | None  ->  ListNode | None
    pass
`,
    js: `function mergeTwoLists(list1, list2) {
  // list1, list2: ListNode | null  ->  ListNode | null
}
`,
    cpp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'splice',
      label: 'Always take the smaller head',
      kind: 'optimal',
      time: 'O(n + m)',
      space: 'O(1)',
      blurb:
        'Both lists are sorted, so the smallest remaining node overall is always one of the two current heads. Repeatedly splice the smaller head onto the tail of the answer; when one list runs dry, the other attaches whole.',
      code: {
        py: {
          lines: [
            'def mergeTwoLists(list1, list2):',
            '    dummy = tail = ListNode()',
            '    while list1 and list2:',
            '        if list1.val <= list2.val:',
            '            tail.next = list1',
            '            list1 = list1.next',
            '        else:',
            '            tail.next = list2',
            '            list2 = list2.next',
            '        tail = tail.next',
            '    tail.next = list1 or list2',
            '    return dummy.next',
          ],
          map: { init: 2, takeA: 5, takeB: 8, drain: 11, done: 12 },
        },
        cpp: {
          lines: [
            'ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {',
            '    ListNode dummy, *tail = &dummy;',
            '    while (list1 && list2) {',
            '        if (list1->val <= list2->val) {',
            '            tail->next = list1; list1 = list1->next;',
            '        } else {',
            '            tail->next = list2; list2 = list2->next;',
            '        }',
            '        tail = tail->next;',
            '    }',
            '    tail->next = list1 ? list1 : list2;',
            '    return dummy.next;',
            '}',
          ],
          map: { init: 2, takeA: 5, takeB: 7, drain: 11, done: 12 },
        },
        js: {
          lines: [
            'function mergeTwoLists(list1, list2) {',
            '  const dummy = new ListNode();',
            '  let tail = dummy;',
            '  while (list1 && list2) {',
            '    if (list1.val <= list2.val) {',
            '      tail.next = list1;',
            '      list1 = list1.next;',
            '    } else {',
            '      tail.next = list2;',
            '      list2 = list2.next;',
            '    }',
            '    tail = tail.next;',
            '  }',
            '  tail.next = list1 ?? list2;',
            '  return dummy.next;',
            '}',
          ],
          map: { init: 2, takeA: 6, takeB: 9, drain: 14, done: 15 },
        },
      },

      trace(t, [a, b]: [number[], number[]]) {
        let i = 0
        let j = 0
        const out: number[] = []

        const view = (tone: Tone, from: 'a' | 'b' | null) => {
          const aTones: Record<number, Tone> = {}
          const bTones: Record<number, Tone> = {}
          a.forEach((_, k) => {
            aTones[k] = k < i ? 'done' : k === i && from === 'a' ? tone : 'idle'
          })
          b.forEach((_, k) => {
            bTones[k] = k < j ? 'done' : k === j && from === 'b' ? tone : 'idle'
          })
          const outTones: Record<number, Tone> = {}
          out.forEach((_, k) => {
            outTones[k] = k === out.length - 1 ? 'good' : 'band'
          })
          return combo(
            arr(a.length ? a : ['—'], {
              tones: aTones,
              pointers: i < a.length ? [{ name: 'p1', at: i, accent: 'a' }] : [],
              title: 'list1',
            }),
            arr(b.length ? b : ['—'], {
              tones: bTones,
              pointers: j < b.length ? [{ name: 'p2', at: j, accent: 'b' }] : [],
              title: 'list2',
            }),
            arr(out.length ? out : ['—'], { tones: outTones, title: 'merged', showIndex: false }),
          )
        }

        t.push({
          step: 'init',
          note: 'A dummy head absorbs the "is this the first node?" special case. The tail then repeatedly grabs whichever list currently shows the smaller value.',
          view: view('idle', null),
          vars: [
            ['list1', a.join(' → ') || 'empty'],
            ['list2', b.join(' → ') || 'empty'],
          ],
        })

        while (i < a.length && j < b.length && !t.full) {
          t.bump()
          if (a[i] <= b[j]) {
            out.push(a[i])
            t.push({
              step: 'takeA',
              note: `${a[i]} ≤ ${b[j]} — splice list1's node onto the merged tail. list1 advances.`,
              view: view('good', 'a'),
              vars: [
                ['took', a[i], 'a'],
                ['merged', out.join(' → '), 'c'],
              ],
              badge: { text: `take ${a[i]} from list1`, accent: 'a' },
            })
            i++
          } else {
            out.push(b[j])
            t.push({
              step: 'takeB',
              note: `${b[j]} < ${a[i]} — splice list2's node instead. list2 advances.`,
              view: view('good', 'b'),
              vars: [
                ['took', b[j], 'b'],
                ['merged', out.join(' → '), 'c'],
              ],
              badge: { text: `take ${b[j]} from list2`, accent: 'b' },
            })
            j++
          }
        }

        const rest = i < a.length ? a.slice(i) : b.slice(j)
        if (rest.length) {
          out.push(...rest)
          t.push({
            step: 'drain',
            note: `${i < a.length ? 'list2' : 'list1'} ran dry. The survivor (${rest.join(' → ')}) is already sorted, so it attaches in one splice — no more comparisons.`,
            view: view('good', null),
            vars: [['attached', rest.join(' → '), 'ok']],
            badge: { text: 'attach the rest', accent: 'ok' },
          })
        }

        t.push({
          step: 'done',
          note: `Merged: ${out.join(' → ') || 'empty'}. Each node was compared at most once, so the cost is the total length.`,
          view: view('good', null),
          vars: [['answer', `[${out.join(', ')}]`, 'ok']],
          badge: { text: 'merged', accent: 'ok' },
        })
      },

      run([a, b]: [number[], number[]], c) {
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
      },
    },
  ],
}
