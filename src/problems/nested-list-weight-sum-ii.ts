import type { Problem } from '@/lib/types'

/**
 * Same scaffold as Nested List Weight Sum: the list arrives in LeetCode's
 * textual form and the starter provides NestedInteger plus a parser.
 */
export const nestedListWeightSumII: Problem = {
  id: 'nested-list-weight-sum-ii',
  title: 'Nested List Weight Sum II',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/nested-list-weight-sum-ii/',
  statement:
    'Same `NestedInteger` structure as Nested List Weight Sum, but the weights are inverted: an integer at depth `d` counts `maxDepth - d + 1` times, so the deepest integers weigh least; `maxDepth` is the depth of the deepest integer. For `[[1,1],2,[1,1]]` that is `1 + 1 + 2*2 + 1 + 1 = 8`. As before the list arrives as a string and the provided `parseNested` turns it into `NestedInteger` objects.',
  constraints: [
    '1 <= nestedList.length <= 50',
    'Integers are in the range [-100, 100]',
    'The maximum depth is at most 50',
  ],
  signature: { fn: 'depthSumInverse', params: [{ name: 'nestedList', type: 'string' }], ret: 'int' },
  tests: [
    { args: ['[[1,1],2,[1,1]]'], expect: 8 },
    { args: ['[1,[4,[6]]]'], expect: 17, note: '1*3 + 4*2 + 6*1' },
    { args: ['[0]'], expect: 0 },
    { args: ['[[[]]]'], expect: 0, note: 'empty lists deepen nothing that exists' },
    { args: ['[7,[[]]]'], expect: 7, note: 'depth is measured by integers, so empty lists do not deepen anything' },
    { args: ['[-100,[100]]'], expect: -100, note: '-100*2 + 100*1' },
    { args: ['[[[[7]]]]'], expect: 7, note: 'the deepest integer weighs one' },
  ],
  demo: ['[[1,1],2,[1,1]]'],
  starter: {
    js: `// Provided: the NestedInteger interface and a parser for the textual form.
class NestedInteger {
  constructor(value) {
    this.value = value; // number, or NestedInteger[]
  }
  isInteger() { return typeof this.value === 'number'; }
  getInteger() { return this.value; }
  getList() { return this.value; }
}
function parseNested(s) {
  const wrap = (v) => new NestedInteger(Array.isArray(v) ? v.map(wrap) : v);
  return JSON.parse(s).map(wrap);
}

function depthSumInverse(nestedList) {
  const list = parseNested(nestedList); // NestedInteger[]
  // your code here  ->  number
}
`,
    cpp: `// Provided: the NestedInteger interface and a parser for the textual form.
class NestedInteger {
    bool isInt;
    int val;
    vector<NestedInteger> list;
public:
    NestedInteger(int v) : isInt(true), val(v) {}
    NestedInteger(vector<NestedInteger> l) : isInt(false), val(0), list(move(l)) {}
    bool isInteger() const { return isInt; }
    int getInteger() const { return val; }
    const vector<NestedInteger>& getList() const { return list; }
};
static NestedInteger parseOne(const string& s, size_t& i) {
    if (s[i] == '[') {
        ++i;
        vector<NestedInteger> items;
        while (s[i] != ']') { items.push_back(parseOne(s, i)); if (s[i] == ',') ++i; }
        ++i;
        return NestedInteger(items);
    }
    int sign = 1;
    if (s[i] == '-') { sign = -1; ++i; }
    int v = 0;
    while (i < s.size() && isdigit(s[i])) v = v * 10 + (s[i++] - '0');
    return NestedInteger(sign * v);
}
static vector<NestedInteger> parseNested(const string& s) { size_t i = 0; return parseOne(s, i).getList(); }

int depthSumInverse(string nestedList) {
    vector<NestedInteger> list = parseNested(nestedList);
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-passes',
      label: 'Find the maximum depth, then weight a second pass',
      kind: 'brute',
      time: 'O(n)',
      space: 'O(d)',
      blurb:
        'The weight of an integer depends on how deep the deepest integer sits, so find that first with one recursive walk, then walk again adding `value * (maxDepth - depth + 1)`. Correct and clear; it simply reads the whole structure twice.',
      code: {
        cpp: {
          lines: [
            '// Provided scaffold, unchanged from the starter',
            'class NestedInteger {',
            '    bool isInt;',
            '    int val;',
            '    vector<NestedInteger> list;',
            'public:',
            '    NestedInteger(int v) : isInt(true), val(v) {}',
            '    NestedInteger(vector<NestedInteger> l) : isInt(false), val(0), list(move(l)) {}',
            '    bool isInteger() const { return isInt; }',
            '    int getInteger() const { return val; }',
            '    const vector<NestedInteger>& getList() const { return list; }',
            '};',
            'static NestedInteger parseOne(const string& s, size_t& i) {',
            "    if (s[i] == '[') {",
            '        ++i;',
            '        vector<NestedInteger> items;',
            "        while (s[i] != ']') { items.push_back(parseOne(s, i)); if (s[i] == ',') ++i; }",
            '        ++i;',
            '        return NestedInteger(items);',
            '    }',
            '    int sign = 1;',
            "    if (s[i] == '-') { sign = -1; ++i; }",
            '    int v = 0;',
            "    while (i < s.size() && isdigit(s[i])) v = v * 10 + (s[i++] - '0');",
            '    return NestedInteger(sign * v);',
            '}',
            'static vector<NestedInteger> parseNested(const string& s) { size_t i = 0; return parseOne(s, i).getList(); }',
            '',
            'static int maxDepth(const vector<NestedInteger>& list, int depth) {',
            '    int deepest = 0;  // the depth of the deepest integer, 0 when there is none',
            '    for (const NestedInteger& item : list) {',
            '        if (item.isInteger()) deepest = max(deepest, depth);',
            '        else deepest = max(deepest, maxDepth(item.getList(), depth + 1));',
            '    }',
            '    return deepest;',
            '}',
            'static int weighted(const vector<NestedInteger>& list, int depth, int deepest) {',
            '    int total = 0;',
            '    for (const NestedInteger& item : list) {',
            '        if (item.isInteger()) total += item.getInteger() * (deepest - depth + 1);',
            '        else total += weighted(item.getList(), depth + 1, deepest);',
            '    }',
            '    return total;',
            '}',
            '',
            'int depthSumInverse(string nestedList) {',
            '    vector<NestedInteger> list = parseNested(nestedList);',
            '    return weighted(list, 1, maxDepth(list, 1));',
            '}',
          ],
        },
        js: {
          lines: [
            '// Provided scaffold, unchanged from the starter',
            'class NestedInteger {',
            '  constructor(value) { this.value = value; }',
            "  isInteger() { return typeof this.value === 'number'; }",
            '  getInteger() { return this.value; }',
            '  getList() { return this.value; }',
            '}',
            'function parseNested(s) {',
            '  const wrap = (v) => new NestedInteger(Array.isArray(v) ? v.map(wrap) : v);',
            '  return JSON.parse(s).map(wrap);',
            '}',
            '',
            'function depthSumInverse(nestedList) {',
            '  // the depth of the deepest integer, 0 when there is none',
            '  const maxDepth = (list, depth) => {',
            '    let deepest = 0;',
            '    for (const item of list) {',
            '      if (item.isInteger()) deepest = Math.max(deepest, depth);',
            '      else deepest = Math.max(deepest, maxDepth(item.getList(), depth + 1));',
            '    }',
            '    return deepest;',
            '  };',
            '  const weighted = (list, depth, deepest) => {',
            '    let total = 0;',
            '    for (const item of list) {',
            '      if (item.isInteger()) total += item.getInteger() * (deepest - depth + 1);',
            '      else total += weighted(item.getList(), depth + 1, deepest);',
            '    }',
            '    return total;',
            '  };',
            '  const list = parseNested(nestedList);',
            '  return weighted(list, 1, maxDepth(list, 1));',
            '}',
          ],
        },
      },

      run([nestedList]: [string], c) {
        type Nested = number | Nested[]
        const maxDepth = (list: Nested[], depth: number): number => {
          let deepest = 0
          for (const item of list) {
            c.ops++
            if (typeof item === 'number') deepest = Math.max(deepest, depth)
            else deepest = Math.max(deepest, maxDepth(item, depth + 1))
          }
          return deepest
        }
        const weighted = (list: Nested[], depth: number, deepest: number): number => {
          let total = 0
          for (const item of list) {
            c.ops++
            if (typeof item === 'number') total += item * (deepest - depth + 1)
            else total += weighted(item, depth + 1, deepest)
          }
          return total
        }
        const list = JSON.parse(nestedList) as Nested[]
        return weighted(list, 1, maxDepth(list, 1))
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'level-by-level',
      label: 'One pass, re-adding the running total at every level',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(n)',
      blurb:
        'The maximum depth never needs to be known. Walk the structure level by level and keep two totals: the plain sum of every integer seen so far, and a weighted answer that gets that plain sum added to it once per level. An integer first seen at depth `d` is then re-added at every deeper level, which is exactly `maxDepth - d + 1` times — provided the answer is read off at the last level that actually held an integer, so trailing empty lists add nothing.',
      code: {
        cpp: {
          lines: [
            '// Provided scaffold, unchanged from the starter',
            'class NestedInteger {',
            '    bool isInt;',
            '    int val;',
            '    vector<NestedInteger> list;',
            'public:',
            '    NestedInteger(int v) : isInt(true), val(v) {}',
            '    NestedInteger(vector<NestedInteger> l) : isInt(false), val(0), list(move(l)) {}',
            '    bool isInteger() const { return isInt; }',
            '    int getInteger() const { return val; }',
            '    const vector<NestedInteger>& getList() const { return list; }',
            '};',
            'static NestedInteger parseOne(const string& s, size_t& i) {',
            "    if (s[i] == '[') {",
            '        ++i;',
            '        vector<NestedInteger> items;',
            "        while (s[i] != ']') { items.push_back(parseOne(s, i)); if (s[i] == ',') ++i; }",
            '        ++i;',
            '        return NestedInteger(items);',
            '    }',
            '    int sign = 1;',
            "    if (s[i] == '-') { sign = -1; ++i; }",
            '    int v = 0;',
            "    while (i < s.size() && isdigit(s[i])) v = v * 10 + (s[i++] - '0');",
            '    return NestedInteger(sign * v);',
            '}',
            'static vector<NestedInteger> parseNested(const string& s) { size_t i = 0; return parseOne(s, i).getList(); }',
            '',
            'int depthSumInverse(string nestedList) {',
            '    vector<NestedInteger> level = parseNested(nestedList);',
            '    int plain = 0, weighted = 0, answer = 0;',
            '    while (!level.empty()) {',
            '        vector<NestedInteger> next;',
            '        bool sawInteger = false;',
            '        for (const NestedInteger& item : level) {',
            '            if (item.isInteger()) { plain += item.getInteger(); sawInteger = true; }',
            '            else next.insert(next.end(), item.getList().begin(), item.getList().end());',
            '        }',
            '        weighted += plain;',
            '        if (sawInteger) answer = weighted;  // levels below the deepest integer do not count',
            '        level = move(next);',
            '    }',
            '    return answer;',
            '}',
          ],
        },
        js: {
          lines: [
            '// Provided scaffold, unchanged from the starter',
            'class NestedInteger {',
            '  constructor(value) { this.value = value; }',
            "  isInteger() { return typeof this.value === 'number'; }",
            '  getInteger() { return this.value; }',
            '  getList() { return this.value; }',
            '}',
            'function parseNested(s) {',
            '  const wrap = (v) => new NestedInteger(Array.isArray(v) ? v.map(wrap) : v);',
            '  return JSON.parse(s).map(wrap);',
            '}',
            '',
            'function depthSumInverse(nestedList) {',
            '  let level = parseNested(nestedList);',
            '  let plain = 0;',
            '  let weighted = 0;',
            '  let answer = 0;',
            '  while (level.length) {',
            '    const next = [];',
            '    let sawInteger = false;',
            '    for (const item of level) {',
            '      if (item.isInteger()) { plain += item.getInteger(); sawInteger = true; }',
            '      else next.push(...item.getList());',
            '    }',
            '    weighted += plain;',
            '    if (sawInteger) answer = weighted; // levels below the deepest integer do not count',
            '    level = next;',
            '  }',
            '  return answer;',
            '}',
          ],
        },
      },

      run([nestedList]: [string], c) {
        type Nested = number | Nested[]
        let level = JSON.parse(nestedList) as Nested[]
        let plain = 0
        let weighted = 0
        let answer = 0
        while (level.length) {
          const next: Nested[] = []
          let sawInteger = false
          for (const item of level) {
            c.ops++
            if (typeof item === 'number') {
              plain += item
              sawInteger = true
            } else next.push(...item)
          }
          weighted += plain
          if (sawInteger) answer = weighted
          level = next
        }
        return answer
      },
    },
  ],
}
