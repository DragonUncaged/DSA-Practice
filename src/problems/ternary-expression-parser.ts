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
    { args: ['F?F?F?1:2:3:4'], expect: '4', note: 'every condition fails' },
    { args: ['T?F?1:2:3'], expect: '2', note: 'nested in the true branch' },
    { args: ['F?1:T?F?2:3:4'], expect: '3', note: 'nested twice in the false branch' },
  ],
  // a right-leaning chain: every level rescans the rest to find its colon
  scale: (n) => ['F?1:'.repeat(Math.max(1, Math.floor(n / 4))) + '0'],
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
      id: 'recursive-descent',
      label: 'Recurse on the two branches after finding the matching colon',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(n)',
      blurb:
        'Read the expression the way the grammar is written: a condition, a `?`, a true branch, the matching `:`, a false branch. Finding that colon means scanning forward while balancing nested `?` and `:` pairs, and every level of nesting rescans the rest of the string — quadratic on a long right-leaning chain.',
      code: {
        cpp: {
          lines: [
            'static string eval(const string& e, int l, int r) {',
            '    if (l == r) return string(1, e[l]);',
            '    int depth = 0, split = -1;',
            '    for (int i = l + 2; i <= r; ++i) {',
            "        if (e[i] == '?') ++depth;",
            "        else if (e[i] == ':') { if (depth == 0) { split = i; break; } --depth; }",
            '    }',
            "    return e[l] == 'T' ? eval(e, l + 2, split - 1) : eval(e, split + 1, r);",
            '}',
            '',
            'string parseTernary(string expression) {',
            '    return eval(expression, 0, expression.size() - 1);',
            '}',
          ],
        },
        js: {
          lines: [
            'function parseTernary(expression) {',
            '  const evalRange = (l, r) => {',
            '    if (l === r) return expression[l];',
            '    let depth = 0;',
            '    let split = -1;',
            '    for (let i = l + 2; i <= r; i++) {',
            "      if (expression[i] === '?') depth++;",
            "      else if (expression[i] === ':') {",
            '        if (depth === 0) { split = i; break; }',
            '        depth--;',
            '      }',
            '    }',
            "    return expression[l] === 'T' ? evalRange(l + 2, split - 1) : evalRange(split + 1, r);",
            '  };',
            '  return evalRange(0, expression.length - 1);',
            '}',
          ],
        },
      },

      run([expression]: [string], c) {
        const evalRange = (l: number, r: number): string => {
          if (l === r) return expression[l]
          let depth = 0
          let split = -1
          for (let i = l + 2; i <= r; i++) {
            c.ops++
            if (expression[i] === '?') depth++
            else if (expression[i] === ':') {
              if (depth === 0) {
                split = i
                break
              }
              depth--
            }
          }
          return expression[l] === 'T' ? evalRange(l + 2, split - 1) : evalRange(split + 1, r)
        }
        return evalRange(0, expression.length - 1)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'right-to-left-stack',
      label: 'Scan right to left with a stack',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'No colon ever needs to be searched for. Because the operator groups to the right, the innermost expression is the one furthest right — so read the string backwards. Every value goes on a stack, and a `?` pops the two branches it already has, reads the condition sitting just before it, and pushes the winner back. One pass.',
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
