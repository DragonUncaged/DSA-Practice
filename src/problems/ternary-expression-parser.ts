import type { Problem } from '@/lib/types'

export const ternaryExpressionParser: Problem = {
  id: 'ternary-expression-parser',
  title: 'Ternary Expression Parser',
  group: 'Medium',
  pattern: 'Stack',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/ternary-expression-parser/',
  statement:
    "Evaluate a nested ternary `expression` made of single digits, `'T'`, `'F'`, `'?'` and `':'`, and return the result as a one-character string. The conditionals group right to left, so `\"F?1:T?4:5\"` reads as `F ? 1 : (T ? 4 : 5)`.",
  constraints: [
    '5 <= expression.length <= 10^4',
    "expression consists of digits and 'T', 'F', '?', ':'",
    'The expression is valid and every number is a single digit',
  ],
  signature: {
    fn: 'parseTernary',
    params: [{ name: 'expression', type: 'string' }],
    ret: 'string',
  },
  tests: [
    { args: ['T?2:3'], expect: '2' },
    { args: ['F?1:T?4:5'], expect: '4', note: 'right to left' },
    { args: ['T?T?F:5:3'], expect: 'F' },
    { args: ['T?1:0'], expect: '1' },
    { args: ['F?1:0'], expect: '0' },
    { args: ['T?T?T?1:2:3:4'], expect: '1', note: 'three levels deep' },
  ],
  demo: ['F?1:T?4:5'],
  starter: {
    js: `function parseTernary(expression) {
  // expression: string  ->  string
}
`,
    cpp: `string parseTernary(string expression) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'right-to-left-stack',
      label: 'Scan right to left with a stack',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'Because the operator groups to the right, the innermost expression is the one furthest right — so read the string backwards. Every value goes on a stack, and a `?` pops the two branches it already has, reads the condition sitting just before it, and pushes the winner back.',
      code: {
        cpp: {
          lines: [
            'string parseTernary(string expression) {',
            '    vector<char> stack;',
            '    for (int i = expression.size() - 1; i >= 0; --i) {',
            '        char ch = expression[i];',
            "        if (ch == ':') continue;",
            "        if (ch != '?') { stack.push_back(ch); continue; }",
            '',
            '        char yes = stack.back();',
            '        stack.pop_back();',
            '        char no = stack.back();',
            '        stack.pop_back();',
            "        stack.push_back(expression[i - 1] == 'T' ? yes : no);",
            '        --i;  // the condition has been consumed',
            '    }',
            '    return string(1, stack.back());',
            '}',
          ],
        },
        js: {
          lines: [
            'function parseTernary(expression) {',
            '  const stack = [];',
            '  for (let i = expression.length - 1; i >= 0; i--) {',
            '    const ch = expression[i];',
            "    if (ch === ':') continue;",
            "    if (ch !== '?') { stack.push(ch); continue; }",
            '',
            '    const yes = stack.pop();',
            '    const no = stack.pop();',
            "    stack.push(expression[i - 1] === 'T' ? yes : no);",
            '    i--; // the condition has been consumed',
            '  }',
            '  return stack.pop();',
            '}',
          ],
        },
      },

      run([expression]: [string], c) {
        const stack: string[] = []
        for (let i = expression.length - 1; i >= 0; i--) {
          c.ops++
          const ch = expression[i]
          if (ch === ':') continue
          if (ch !== '?') {
            stack.push(ch)
            continue
          }
          const yes = stack.pop()!
          const no = stack.pop()!
          stack.push(expression[i - 1] === 'T' ? yes : no)
          i--
        }
        return stack.pop()
      },
    },
  ],
}
