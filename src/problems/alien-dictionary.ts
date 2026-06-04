import { combo, mapOf, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string[]] = [['wrt', 'wrf', 'er', 'ett', 'rftt']]

export const alienDictionary: Problem = {
  id: 'alien-dictionary',
  title: 'Alien Dictionary',
  group: 'Graph',
  pattern: 'Topological Sort',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/alien-dictionary/',
  statement:
    'A list of `words` is sorted by the rules of an alien alphabet. Recover a valid letter ordering and return it as a string, or `""` if the list is self-contradictory.',
  constraints: ['1 <= words.length <= 100', 'Lowercase letters only', 'Return "" on contradiction'],
  signature: { fn: 'alienOrder', params: [{ name: 'words', type: 'string[]' }], ret: 'string' },
  tests: [
    { args: [['wrt', 'wrf', 'er', 'ett', 'rftt']], expect: 'wertf' },
    { args: [['z', 'x']], expect: 'zx' },
    { args: [['z', 'x', 'z']], expect: '', note: 'z before x before z is a contradiction' },
    { args: [['abc', 'ab']], expect: '', note: 'a word cannot precede its own prefix' },
  ],
  demo: DEMO,
  starter: {
    js: `function alienOrder(words) {
  // words: string[]  ->  string
}
`,
    cpp: `string alienOrder(vector<string>& words) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'topo',
      label: 'Compare neighbours, then peel',
      kind: 'optimal',
      time: 'O(total letters)',
      space: 'O(1) — alphabet-sized',
      blurb:
        'Each adjacent pair of words yields at most one fact: the first letter where they differ orders those two letters. Those facts form a graph over the alphabet, and any topological order of that graph is a valid alien alphabet. A cycle means the input lied.',
      code: {
        cpp: {
          lines: [
            'string alienOrder(vector<string>& words) {',
            '    map<char, set<char>> adj;',
            '    map<char, int> indeg;',
            '    for (auto& w : words) for (char c : w) { adj[c]; indeg[c]; }',
            '    for (int i = 0; i + 1 < words.size(); ++i) {',
            '        auto &a = words[i], &b = words[i + 1];',
            '        int k = 0;',
            '        while (k < a.size() && k < b.size() && a[k] == b[k]) k++;',
            '        if (k == b.size() && a.size() > b.size()) return "";',
            '        if (k < a.size() && k < b.size() && !adj[a[k]].count(b[k])) {',
            '            adj[a[k]].insert(b[k]);',
            '            indeg[b[k]]++;',
            '        }',
            '    }',
            '    string out;',
            '    vector<char> q;',
            '    for (auto& [c, d] : indeg) if (d == 0) q.push_back(c);',
            '    while (!q.empty()) {',
            '        char c = q.back(); q.pop_back();',
            '        out += c;',
            '        for (char nxt : adj[c]) if (--indeg[nxt] == 0) q.push_back(nxt);',
            '    }',
            '    return out.size() == adj.size() ? out : "";',
            '}',
          ],
          map: { init: 4, edge: 11, prefix: 9, take: 20, done: 23, cycle: 23 },
        },
        js: {
          lines: [
            'function alienOrder(words) {',
            '  const adj = new Map();',
            '  const indeg = new Map();',
            '  for (const w of words)',
            '    for (const c of w) {',
            '      if (!adj.has(c)) { adj.set(c, new Set()); indeg.set(c, 0); }',
            '    }',
            '  for (let i = 0; i + 1 < words.length; i++) {',
            '    const [a, b] = [words[i], words[i + 1]];',
            '    let k = 0;',
            '    while (k < a.length && k < b.length && a[k] === b[k]) k++;',
            '    if (k === b.length && a.length > b.length) return "";',
            '    if (k < a.length && k < b.length && !adj.get(a[k]).has(b[k])) {',
            '      adj.get(a[k]).add(b[k]);',
            '      indeg.set(b[k], indeg.get(b[k]) + 1);',
            '    }',
            '  }',
            '  const queue = [...indeg.keys()].filter((c) => indeg.get(c) === 0);',
            '  let out = "";',
            '  while (queue.length) {',
            '    const c = queue.pop();',
            '    out += c;',
            '    for (const nxt of adj.get(c)) {',
            '      indeg.set(nxt, indeg.get(nxt) - 1);',
            '      if (indeg.get(nxt) === 0) queue.push(nxt);',
            '    }',
            '  }',
            '  return out.length === adj.size ? out : "";',
            '}',
          ],
          map: { init: 6, edge: 14, prefix: 12, take: 22, done: 28, cycle: 28 },
        },
      },

      trace(t, [words]: [string[]]) {
        const adj = new Map<string, Set<string>>()
        const indeg = new Map<string, number>()
        for (const w of words) {
          for (const ch of w) {
            if (!adj.has(ch)) {
              adj.set(ch, new Set())
              indeg.set(ch, 0)
            }
          }
        }

        const edges: [string, string][] = []
        const view = (out: string, focus: string | null, tone: Tone) =>
          combo(
            mapOf(
              edges.map(([a, b]) => ({
                k: `${a} < ${b}`,
                tone: focus === `${a}${b}` ? tone : ('band' as Tone),
              })),
              { title: 'facts extracted from neighbouring words', asSet: true },
            ),
            text(out.padEnd(adj.size, '·'), {
              tones: Object.fromEntries(out.split('').map((_, i) => [i, 'good' as Tone])),
              title: 'alphabet recovered so far',
              showIndex: false,
            }),
          )

        t.push({
          step: 'init',
          note: `${adj.size} distinct letters across ${words.length} words. Only neighbouring words carry information — compare each pair and keep the first differing letter.`,
          view: view('', null, 'idle'),
          vars: [['letters', adj.size]],
        })

        for (let i = 0; i + 1 < words.length && !t.full; i++) {
          const a = words[i]
          const b = words[i + 1]
          let k = 0
          while (k < a.length && k < b.length && a[k] === b[k]) k++
          t.bump()

          if (k === b.length && a.length > b.length) {
            t.push({
              step: 'prefix',
              note: `"${a}" comes before "${b}", but "${b}" is its own prefix — impossible in any alphabet. Return "".`,
              view: view('', null, 'bad'),
              vars: [['answer', '""', 'no']],
              badge: { text: 'contradiction', accent: 'no' },
            })
            return
          }

          if (k < a.length && k < b.length && !adj.get(a[k])!.has(b[k])) {
            adj.get(a[k])!.add(b[k])
            indeg.set(b[k], indeg.get(b[k])! + 1)
            edges.push([a[k], b[k]])
            t.push({
              step: 'edge',
              note: `"${a}" vs "${b}": first difference at position ${k} — '${a[k]}' sorts before '${b[k]}'. One new fact for the graph.`,
              view: view('', `${a[k]}${b[k]}`, 'good'),
              vars: [
                ['pair', `"${a}" < "${b}"`],
                ['fact', `${a[k]} < ${b[k]}`, 'ok'],
              ],
              badge: { text: `${a[k]} < ${b[k]}`, accent: 'ok' },
            })
          }
        }

        const queue = [...indeg.keys()].filter((ch) => indeg.get(ch) === 0)
        let out = ''
        while (queue.length && !t.full) {
          const ch = queue.pop()!
          out += ch
          t.bump()
          t.push({
            step: 'take',
            note: `'${ch}' has no letter required before it — it can go next in the alphabet. Its successors each lose one requirement.`,
            view: view(out, null, 'good'),
            vars: [
              ['placed', ch, 'ok'],
              ['alphabet', out, 'c'],
            ],
            badge: { text: `place '${ch}'`, accent: 'ok' },
          })
          for (const nxt of adj.get(ch)!) {
            indeg.set(nxt, indeg.get(nxt)! - 1)
            if (indeg.get(nxt) === 0) queue.push(nxt)
          }
        }

        const ok = out.length === adj.size
        t.push({
          step: ok ? 'done' : 'cycle',
          note: ok
            ? `All ${adj.size} letters placed: "${out}" is a valid alien alphabet.`
            : `Only ${out.length} of ${adj.size} letters could be placed — the rest wait on each other in a cycle. The word list contradicts itself; return "".`,
          view: view(out, null, ok ? 'good' : 'bad'),
          vars: [['answer', ok ? `"${out}"` : '""', ok ? 'ok' : 'no']],
          badge: { text: ok ? `"${out}"` : 'cycle', accent: ok ? 'ok' : 'no' },
        })
      },

      run([words]: [string[]], c) {
        const adj = new Map<string, Set<string>>()
        const indeg = new Map<string, number>()
        for (const w of words) {
          for (const ch of w) {
            c.ops++
            if (!adj.has(ch)) {
              adj.set(ch, new Set())
              indeg.set(ch, 0)
            }
          }
        }
        for (let i = 0; i + 1 < words.length; i++) {
          const a = words[i]
          const b = words[i + 1]
          let k = 0
          while (k < a.length && k < b.length && a[k] === b[k]) {
            c.ops++
            k++
          }
          if (k === b.length && a.length > b.length) return ''
          if (k < a.length && k < b.length && !adj.get(a[k])!.has(b[k])) {
            adj.get(a[k])!.add(b[k])
            indeg.set(b[k], indeg.get(b[k])! + 1)
          }
        }
        const queue = [...indeg.keys()].filter((ch) => indeg.get(ch) === 0)
        let out = ''
        while (queue.length) {
          const ch = queue.pop()!
          out += ch
          for (const nxt of adj.get(ch)!) {
            c.ops++
            indeg.set(nxt, indeg.get(nxt)! - 1)
            if (indeg.get(nxt) === 0) queue.push(nxt)
          }
        }
        return out.length === adj.size ? out : ''
      },
    },
  ],
}
