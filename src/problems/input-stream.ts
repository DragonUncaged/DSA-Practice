import type { Problem } from '@/lib/types'

export const inputStream: Problem = {
  id: 'input-stream',
  title: 'Input Stream',
  group: 'String',
  pattern: 'Two Pointers',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/backspace-string-compare/',
  statement:
    'Two typed streams `inputA` and `inputB` hold lowercase letters and the character `<`, which means a backspace and deletes the character before it. A backspace on an empty stream does nothing. Return `true` if the two streams finish showing the same text.',
  constraints: [
    '0 <= inputA.length, inputB.length <= 10^5',
    'Each stream holds lowercase letters and the backspace character <',
    'A backspace on empty text is ignored',
  ],
  signature: {
    fn: 'inputStream',
    params: [
      { name: 'inputA', type: 'string' },
      { name: 'inputB', type: 'string' },
    ],
    ret: 'bool',
  },
  tests: [
    { args: ['abc<', 'ab'], expect: true },
    { args: ['abc', 'abd'], expect: false },
    { args: ['a<<b', 'b'], expect: true, note: 'a backspace on empty text is harmless' },
    { args: ['abcd<<', 'ab'], expect: true },
    { args: ['a<b', 'ab'], expect: false },
  ],
  demo: ['abc<', 'ab'],
  scale: (n) => {
    const s = 'ab<'.repeat(Math.max(1, Math.floor(n / 3)))
    return [s, s]
  },
  starter: {
    js: `function inputStream(inputA, inputB) {
  // inputA: string, inputB: string  ->  boolean
}
`,
    cpp: `bool inputStream(string inputA, string inputB) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'replay',
      label: 'Replay each stream onto a stack',
      kind: 'optimal',
      time: 'O(n + m)',
      space: 'O(n + m)',
      blurb:
        'A backspace only ever affects the character immediately before it, which is precisely the top of a stack. Replay each stream — push a letter, pop on a backspace, ignore a pop on empty — and compare the two finished stacks. Reading right to left would drop the space cost, but the stack version is the one that stays obvious.',
      code: {
        cpp: {
          lines: [
            'bool inputStream(string inputA, string inputB) {',
            '    auto typed = [](const string& in) {',
            '        string out;',
            '        for (char ch : in) {',
            '            if (ch == \'<\') { if (!out.empty()) out.pop_back(); }',
            '            else out += ch;',
            '        }',
            '        return out;',
            '    };',
            '    return typed(inputA) == typed(inputB);',
            '}',
          ],
        },
        js: {
          lines: [
            'function inputStream(inputA, inputB) {',
            '  const typed = (input) => {',
            '    const out = [];',
            '    for (const ch of input) {',
            '      if (ch === "<") out.pop();',
            '      else out.push(ch);',
            '    }',
            '    return out.join("");',
            '  };',
            '  return typed(inputA) === typed(inputB);',
            '}',
          ],
        },
      },

      run([inputA, inputB]: [string, string], c) {
        const typed = (input: string) => {
          const out: string[] = []
          for (const ch of input) {
            c.ops++
            if (ch === '<') out.pop()
            else out.push(ch)
          }
          return out.join('')
        }
        return typed(inputA) === typed(inputB)
      },
    },
  ],
}
