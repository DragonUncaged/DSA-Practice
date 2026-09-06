import type { Problem } from '@/lib/types'

/**
 * The runner has no NestedInteger type, so the list arrives in LeetCode's
 * textual form and the starter provides the NestedInteger class plus a parser.
 * The learner works against the real interface: isInteger, getInteger, getList.
 */
export const nestedListWeightSum: Problem = {
  id: 'nested-list-weight-sum',
  title: 'Nested List Weight Sum',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/nested-list-weight-sum/',
  statement:
    "A `NestedInteger` is either a single integer or a list of `NestedInteger`s, and an integer's depth is how many lists enclose it. Given `nestedList`, return the sum of every integer multiplied by its depth. For `[[1,1],2,[1,1]]` that is `1*2 + 1*2 + 2*1 + 1*2 + 1*2 = 10`. Here the list arrives as a string in that form; the provided `parseNested` turns it into `NestedInteger` objects with the usual `isInteger`, `getInteger` and `getList`.",
  constraints: [
    '1 <= nestedList.length <= 50',
    'Integers are in the range [-100, 100]',
    'The maximum depth is at most 50',
  ],
  signature: { fn: 'depthSum', params: [{ name: 'nestedList', type: 'string' }], ret: 'int' },
  tests: [
    { args: ['[[1,1],2,[1,1]]'], expect: 10 },
    { args: ['[1,[4,[6]]]'], expect: 27, note: '1*1 + 4*2 + 6*3' },
    { args: ['[0]'], expect: 0, note: 'a single integer at depth one' },
    { args: ['[[[]]]'], expect: 0, note: 'nothing but empty lists' },
    { args: ['[-100,[100]]'], expect: 100, note: 'negative values: -100 + 100*2' },
    { args: ['[[[[7]]]]'], expect: 28, note: 'one integer buried four deep' },
    { args: ['[1,2,3,[],[4]]'], expect: 14, note: 'an empty list in the middle changes nothing' },
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

function depthSum(nestedList) {
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

int depthSum(string nestedList) {
    vector<NestedInteger> list = parseNested(nestedList);
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'dfs-with-depth',
      label: 'Recurse, carrying the depth down',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(d)',
      blurb:
        'Every integer needs to know how many lists surround it, and the recursion already knows: pass the current depth into each nested list as depth plus one, and add `value * depth` at every integer. A breadth-first walk level by level does the same work in the same time, so this single pass is the one shown.',
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
            'static int weighted(const vector<NestedInteger>& list, int depth) {',
            '    int total = 0;',
            '    for (const NestedInteger& item : list) {',
            '        if (item.isInteger()) total += item.getInteger() * depth;',
            '        else total += weighted(item.getList(), depth + 1);',
            '    }',
            '    return total;',
            '}',
            '',
            'int depthSum(string nestedList) {',
            '    return weighted(parseNested(nestedList), 1);',
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
            'function depthSum(nestedList) {',
            '  const weighted = (list, depth) => {',
            '    let total = 0;',
            '    for (const item of list) {',
            '      if (item.isInteger()) total += item.getInteger() * depth;',
            '      else total += weighted(item.getList(), depth + 1);',
            '    }',
            '    return total;',
            '  };',
            '  return weighted(parseNested(nestedList), 1);',
            '}',
          ],
        },
      },

      run([nestedList]: [string], c) {
        type Nested = number | Nested[]
        const weighted = (list: Nested[], depth: number): number => {
          let total = 0
          for (const item of list) {
            c.ops++
            if (typeof item === 'number') total += item * depth
            else total += weighted(item, depth + 1)
          }
          return total
        }
        return weighted(JSON.parse(nestedList) as Nested[], 1)
      },
    },
  ],
}
