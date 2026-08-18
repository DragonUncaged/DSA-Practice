import type { Problem } from '@/lib/types'

export const flipGame: Problem = {
  id: 'flip-game',
  title: 'Flip Game',
  group: 'Easy',
  pattern: 'String Scan',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/flip-game/',
  statement:
    'A move in Flip Game turns two consecutive `+` into `--`. Given `currentState`, return every state reachable in one move, in any order. Return an empty list when no move is available.',
  constraints: ['1 <= currentState.length <= 500', "currentState[i] is either '+' or '-'"],
  signature: {
    fn: 'generatePossibleNextMoves',
    params: [{ name: 'currentState', type: 'string' }],
    ret: 'string[]',
  },
  compare: 'sorted',
  tests: [
    { args: ['++++'], expect: ['--++', '+--+', '++--'] },
    { args: ['+'], expect: [], note: 'nothing to flip' },
    { args: ['--'], expect: [], note: 'no pair of plusses' },
    { args: ['++'], expect: ['--'], note: 'the only move' },
    { args: ['+-+'], expect: [], note: 'the plusses are not adjacent' },
    { args: ['+++'], expect: ['--+', '+--'] },
    { args: ['-++-'], expect: ['----'], note: 'the pair sits between minuses' },
    { args: ['++-++'], expect: ['---++', '++---'], note: 'two separate pairs' },
  ],
  demo: ['++++'],
  scale: (n) => ['+'.repeat(n)],
  starter: {
    js: `function generatePossibleNextMoves(currentState) {
  // currentState: string  ->  string[]
}
`,
    cpp: `vector<string> generatePossibleNextMoves(string currentState) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'scan-pairs',
      label: 'Flip each adjacent pair in turn',
      kind: 'optimal',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'There is only one shape of answer here: every move is decided by where the pair starts, so walk the string once and, at each `++`, write out the string with that pair flipped. Building each result costs `O(n)`, which is where the quadratic total comes from, and no approach avoids it — the output itself is that large.',
      code: {
        cpp: {
          lines: [
            'vector<string> generatePossibleNextMoves(string currentState) {',
            '    vector<string> out;',
            '    for (size_t i = 0; i + 1 < currentState.size(); ++i) {',
            "        if (currentState[i] != '+' || currentState[i + 1] != '+') continue;",
            '        string next = currentState;',
            "        next[i] = next[i + 1] = '-';",
            '        out.push_back(next);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function generatePossibleNextMoves(currentState) {',
            '  const out = [];',
            '  for (let i = 0; i + 1 < currentState.length; i++) {',
            "    if (currentState[i] !== '+' || currentState[i + 1] !== '+') continue;",
            "    out.push(currentState.slice(0, i) + '--' + currentState.slice(i + 2));",
            '  }',
            '  return out;',
            '}',
          ],
        },
      },

      run([state]: [string], c) {
        const out: string[] = []
        for (let i = 0; i + 1 < state.length; i++) {
          c.ops++
          if (state[i] !== '+' || state[i + 1] !== '+') continue
          c.ops += state.length // each result is a fresh copy of the string
          out.push(state.slice(0, i) + '--' + state.slice(i + 2))
        }
        return out
      },
    },
  ],
}
