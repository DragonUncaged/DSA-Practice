import { arr, combo, mapOf, type Problem, type Tone } from '@/lib/types'

const DEMO: [string[]] = [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']]

export const groupAnagrams: Problem = {
  id: 'group-anagrams',
  title: 'Group Anagrams',
  group: 'String',
  pattern: 'Canonical Key',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/group-anagrams/',
  statement: 'Given an array of strings, group the anagrams together. Groups and their members may be in any order.',
  constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'Lowercase English letters'],
  signature: { fn: 'groupAnagrams', params: [{ name: 'strs', type: 'string[]' }], ret: 'string[][]' },
  compare: 'set',
  tests: [
    { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expect: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
    { args: [['']], expect: [['']] },
    { args: [['a']], expect: [['a']] },
    { args: [['ab', 'ba', 'abc']], expect: [['ab', 'ba'], ['abc']] },
  ],
  demo: DEMO,
  scale: (n) => [
    Array.from({ length: n }, (_, i) => {
      const base = ['abc', 'bca', 'cab', 'xyz', 'zyx'][i % 5]
      return base + String.fromCharCode(97 + (Math.floor(i / 5) % 26))
    }),
  ],
  starter: {
    py: `def groupAnagrams(strs):
    # strs: list[str]  ->  list[list[str]]
    pass
`,
    js: `function groupAnagrams(strs) {
  // strs: string[]  ->  string[][]
}
`,
    cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'sort-key',
      label: 'Sorted letters as the group key',
      kind: 'optimal',
      time: 'O(n * k log k)',
      space: 'O(n * k)',
      blurb:
        'Anagrams become identical when you sort their letters — "eat", "tea" and "ate" all collapse to "aet". That canonical form is a perfect dictionary key: one pass, each word filed under its sorted self.',
      code: {
        py: {
          lines: [
            'def groupAnagrams(strs):',
            '    groups = {}',
            '    for w in strs:',
            "        key = ''.join(sorted(w))",
            '        groups.setdefault(key, []).append(w)',
            '    return list(groups.values())',
          ],
          map: { init: 2, key: 4, file: 5, done: 6 },
        },
        cpp: {
          lines: [
            'vector<vector<string>> groupAnagrams(vector<string>& strs) {',
            '    unordered_map<string, vector<string>> groups;',
            '    for (auto& w : strs) {',
            '        string key = w;',
            '        sort(key.begin(), key.end());',
            '        groups[key].push_back(w);',
            '    }',
            '    vector<vector<string>> out;',
            '    for (auto& [k, v] : groups) out.push_back(v);',
            '    return out;',
            '}',
          ],
          map: { init: 2, key: 5, file: 6, done: 10 },
        },
        js: {
          lines: [
            'function groupAnagrams(strs) {',
            '  const groups = new Map();',
            '  for (const w of strs) {',
            "    const key = [...w].sort().join('');",
            '    if (!groups.has(key)) groups.set(key, []);',
            '    groups.get(key).push(w);',
            '  }',
            '  return [...groups.values()];',
            '}',
          ],
          map: { init: 2, key: 4, file: 6, done: 8 },
        },
      },

      trace(t, [strs]: [string[]]) {
        const n = strs.length
        const groups = new Map<string, string[]>()

        const view = (i: number | null, hotKey: string | null, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          strs.forEach((_, k) => {
            tones[k] = i == null ? 'done' : k < i ? 'done' : k === i ? tone : 'idle'
          })
          return combo(
            arr(strs, { tones, pointers: i != null ? [{ name: 'w', at: i, accent: 'a' }] : [], title: 'words' }),
            mapOf(
              [...groups.entries()].map(([k, v]) => ({
                k: `"${k}"`,
                v: v.join(', '),
                tone: k === hotKey ? tone : ('band' as Tone),
              })),
              { title: 'groups, keyed by sorted letters' },
            ),
          )
        }

        t.push({
          step: 'init',
          note: 'Sorting a word\'s letters produces a canonical form shared by exactly its anagrams. The dictionary does the grouping for free.',
          view: view(0, null, 'idle'),
          vars: [['words', n]],
        })

        for (let i = 0; i < n && !t.full; i++) {
          const w = strs[i]
          const key = [...w].sort().join('')
          t.bump()

          const existed = groups.has(key)
          if (!existed) groups.set(key, [])
          groups.get(key)!.push(w)

          t.push({
            step: existed ? 'file' : 'key',
            note: existed
              ? `"${w}" sorts to "${key}" — that key already exists, so it joins ${groups.get(key)!.slice(0, -1).map((x) => `"${x}"`).join(', ')}.`
              : `"${w}" sorts to "${key}" — a key nobody has produced yet, so it opens a new group.`,
            view: view(i, key, existed ? 'good' : 'active'),
            vars: [
              ['word', w, 'a'],
              ['key', key, 'c'],
              ['group size', groups.get(key)!.length, existed ? 'ok' : 'c'],
            ],
            badge: {
              text: existed ? `join "${key}"` : `new group "${key}"`,
              accent: existed ? 'ok' : 'c',
            },
          })
        }

        t.push({
          step: 'done',
          note: `${groups.size} group${groups.size === 1 ? '' : 's'} formed. Each word paid one sort of its own letters — the array itself was never sorted.`,
          view: view(null, null, 'good'),
          vars: [['answer', JSON.stringify([...groups.values()]), 'ok']],
          badge: { text: `${groups.size} groups`, accent: 'ok' },
        })
      },

      run([strs]: [string[]], c) {
        const groups = new Map<string, string[]>()
        for (const w of strs) {
          c.ops += Math.max(1, w.length)
          const key = [...w].sort().join('')
          if (!groups.has(key)) groups.set(key, [])
          groups.get(key)!.push(w)
        }
        return [...groups.values()]
      },
    },
  ],
}
