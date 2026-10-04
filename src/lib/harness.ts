/**
 * Turns a problem signature + its test cases into runnable source for each
 * language, so the same test table drives JS and C++ without any
 * per-problem harness code.
 *
 * Layout of a generated program is always: preamble → user code → runner.
 * User code comes after the preamble so it can use ListNode and TreeNode
 * without declaring them.
 */

import type { DesignSpec, DesignTestCase, Lang, ParamType, Signature, TestCase } from './types'

/**
 * Prefixes every serialized result line so we can tell it apart from anything
 * the learner printed. Plain ASCII so it survives C++ narrow string literals.
 */
export const RESULT_MARK = '@@__trace__@@'

// ---------------------------------------------------------------------------
// JavaScript
// ---------------------------------------------------------------------------

const JS_PREAMBLE = `
function ListNode(val, next) { this.val = val === undefined ? 0 : val; this.next = next === undefined ? null : next; }
function TreeNode(val, left, right) { this.val = val === undefined ? 0 : val; this.left = left === undefined ? null : left; this.right = right === undefined ? null : right; }
function __toList(a) { let head = null; for (let i = a.length - 1; i >= 0; i--) head = new ListNode(a[i], head); return head; }
function __toCycle(pair) {
  const [vals, pos] = pair;
  const head = __toList(vals);
  if (pos >= 0 && head) {
    let tail = head; while (tail.next) tail = tail.next;
    let target = head; for (let i = 0; i < pos; i++) target = target.next;
    tail.next = target;
  }
  return head;
}
function __fromList(h) { const o = []; let g = 0; while (h && g++ < 10000) { o.push(h.val); h = h.next; } return o; }
function __toTree(a) {
  if (!a.length || a[0] == null) return null;
  const root = new TreeNode(a[0]); const q = [root];
  let i = 1;
  while (q.length && i < a.length) {
    const n = q.shift();
    if (i < a.length) { const v = a[i++]; if (v != null) { n.left = new TreeNode(v); q.push(n.left); } }
    if (i < a.length) { const v = a[i++]; if (v != null) { n.right = new TreeNode(v); q.push(n.right); } }
  }
  return root;
}
function __fromTree(r) {
  if (!r) return [];
  const out = []; const q = [r];
  while (q.length) {
    const n = q.shift();
    if (!n) { out.push(null); continue; }
    out.push(n.val); q.push(n.left, n.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
`.trim()

// ---------------------------------------------------------------------------
// C++
// ---------------------------------------------------------------------------

const CPP_PREAMBLE = `
#include <bits/stdc++.h>
using namespace std;

struct ListNode { int val; ListNode *next; ListNode(int x = 0, ListNode *n = nullptr) : val(x), next(n) {} };
struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x = 0) : val(x), left(nullptr), right(nullptr) {} };

static ListNode* __toList(const vector<int>& a) {
  ListNode* head = nullptr;
  for (int i = (int)a.size() - 1; i >= 0; --i) head = new ListNode(a[i], head);
  return head;
}
static ListNode* __toCycle(const vector<int>& vals, int pos) {
  ListNode* head = __toList(vals);
  if (pos >= 0 && head) {
    ListNode* tail = head; while (tail->next) tail = tail->next;
    ListNode* target = head; for (int i = 0; i < pos; ++i) target = target->next;
    tail->next = target;
  }
  return head;
}
static TreeNode* __toTree(const vector<string>& a) {
  if (a.empty() || a[0] == "null") return nullptr;
  TreeNode* root = new TreeNode(stoi(a[0]));
  queue<TreeNode*> q; q.push(root);
  size_t i = 1;
  while (!q.empty() && i < a.size()) {
    TreeNode* n = q.front(); q.pop();
    if (i < a.size()) { string v = a[i++]; if (v != "null") { n->left = new TreeNode(stoi(v)); q.push(n->left); } }
    if (i < a.size()) { string v = a[i++]; if (v != "null") { n->right = new TreeNode(stoi(v)); q.push(n->right); } }
  }
  return root;
}

// Results are read back as JSON, so a returned string carrying a quote or a
// backslash has to be escaped on the way out or the whole case is unparseable.
static string __esc(const string& s) {
  string o;
  for (unsigned char c : s) {
    if (c == '"' || c == '\\\\') { o += '\\\\'; o += (char)c; }
    else if (c == '\\n') o += "\\\\n";
    else if (c == '\\r') o += "\\\\r";
    else if (c == '\\t') o += "\\\\t";
    else if (c < 0x20) { char b[8]; snprintf(b, sizeof b, "\\\\u%04x", c); o += b; }
    else o += (char)c;
  }
  return o;
}

static void __p(int x) { cout << x; }
static void __p(long long x) { cout << x; }
static void __p(bool x) { cout << (x ? "true" : "false"); }
static void __p(double x) { ostringstream o; o << setprecision(17) << x; cout << o.str(); }
static void __p(char c) { cout << '"' << __esc(string(1, c)) << '"'; }
static void __p(const string& s) { cout << '"' << __esc(s) << '"'; }
template <class T> static void __p(const vector<T>& v) {
  cout << '[';
  for (size_t i = 0; i < v.size(); ++i) { if (i) cout << ','; __p(v[i]); }
  cout << ']';
}
static void __p(ListNode* h) {
  cout << '['; int g = 0;
  for (ListNode* c = h; c && g < 10000; c = c->next, ++g) { if (g) cout << ','; cout << c->val; }
  cout << ']';
}
static void __p(TreeNode* r) {
  vector<string> out;
  if (r) {
    queue<TreeNode*> q; q.push(r);
    while (!q.empty()) {
      TreeNode* n = q.front(); q.pop();
      if (!n) { out.push_back("null"); continue; }
      out.push_back(to_string(n->val)); q.push(n->left); q.push(n->right);
    }
    while (!out.empty() && out.back() == "null") out.pop_back();
  }
  cout << '[';
  for (size_t i = 0; i < out.size(); ++i) { if (i) cout << ','; cout << out[i]; }
  cout << ']';
}
`.trim()

// ---------------------------------------------------------------------------
// Literal emitters
// ---------------------------------------------------------------------------

const q = (s: string) => JSON.stringify(String(s))

/** A single C++ char literal: a quote or a backslash cell must not close it. */
const CHAR_ESCAPE: Record<string, string> = {
  "'": "\\'",
  '\\': '\\\\',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\0': '\\0',
}
const cppChar = (c: string) => `'${CHAR_ESCAPE[c] ?? c}'`

function cppLiteral(type: ParamType, v: unknown): string {
  switch (type) {
    case 'int':
      return String(v)
    case 'double':
      return String(v)
    case 'bool':
      return v ? 'true' : 'false'
    case 'string':
      return q(v as string)
    case 'int[]':
      return `vector<int>{${(v as number[]).join(',')}}`
    case 'string[]':
      return `vector<string>{${(v as string[]).map(q).join(',')}}`
    case 'double[]':
      return `vector<double>{${(v as number[]).join(',')}}`
    case 'string[][]':
      return `vector<vector<string>>{${(v as string[][])
        .map((r) => `{${r.map(q).join(',')}}`)
        .join(',')}}`
    case 'list[]':
      return `vector<ListNode*>{${(v as number[][])
        .map((a) => `__toList(vector<int>{${a.join(',')}})`)
        .join(',')}}`
    case 'cycle': {
      const [vals, pos] = v as [number[], number]
      return `__toCycle(vector<int>{${vals.join(',')}}, ${pos})`
    }
    case 'int[][]':
      return `vector<vector<int>>{${(v as number[][]).map((r) => `{${r.join(',')}}`).join(',')}}`
    case 'char[][]':
      return `vector<vector<char>>{${(v as string[][])
        .map((r) => `{${r.map(cppChar).join(',')}}`)
        .join(',')}}`
    case 'list':
      return `__toList(vector<int>{${(v as number[]).join(',')}})`
    case 'tree':
      return `__toTree(vector<string>{${(v as (number | null)[])
        .map((x) => (x == null ? '"null"' : q(String(x))))
        .join(',')}})`
  }
}

const CPP_TYPE: Record<ParamType, string> = {
  int: 'int',
  double: 'double',
  bool: 'bool',
  string: 'string',
  'int[]': 'vector<int>',
  'string[]': 'vector<string>',
  'double[]': 'vector<double>',
  'string[][]': 'vector<vector<string>>',
  'list[]': 'vector<ListNode*>',
  cycle: 'ListNode*',
  'int[][]': 'vector<vector<int>>',
  'char[][]': 'vector<vector<char>>',
  list: 'ListNode*',
  tree: 'TreeNode*',
}

/** JS argument expression: wraps raw JSON in a structure builder when needed. */
function wrapArg(lang: 'js', type: ParamType, json: string): string {
  if (type === 'list') return `__toList(${json})`
  if (type === 'list[]') return `(${json}).map(__toList)`
  if (type === 'cycle') return `__toCycle(${json})`
  if (type === 'tree') return `__toTree(${json})`
  return json
}

function wrapRet(lang: 'js', type: ParamType, expr: string): string {
  if (type === 'list') return `__fromList(${expr})`
  if (type === 'tree') return `__fromTree(${expr})`
  return expr
}

// ---------------------------------------------------------------------------
// Program builders
// ---------------------------------------------------------------------------

export function buildProgram(lang: Lang, userCode: string, sig: Signature, tests: TestCase[]): string {
  if (lang === 'js') {
    const calls = tests
      .map((t) => {
        const args = sig.params.map((p, i) => wrapArg('js', p.type, JSON.stringify(t.args[i]))).join(', ')
        return `  try { __emit(${wrapRet('js', sig.ret, `__fn(${args})`)}); } catch (e) { __fail(e); }`
      })
      .join('\n')

    return `${JS_PREAMBLE}
// ---- your code ----
${userCode}
// ---- runner ----
;(function () {
  const __fn = typeof ${sig.fn} === 'function' ? ${sig.fn} : null;
  if (!__fn) { console.error('Could not find a function named ${sig.fn}(...)'); return; }
  const __emit = (v) => console.log(${JSON.stringify(RESULT_MARK)} + JSON.stringify(v === undefined ? null : v));
  const __fail = (e) => console.log(${JSON.stringify(RESULT_MARK)} + JSON.stringify({ __error: String((e && e.message) || e) }));
${calls}
})();`
  }

  // C++
  const calls = tests
    .map((t, ti) => {
      const decls = sig.params
        .map((p, i) => `    ${CPP_TYPE[p.type]} ${p.name} = ${cppLiteral(p.type, t.args[i])};`)
        .join('\n')
      const argList = sig.params.map((p) => p.name).join(', ')
      return `  { // case ${ti + 1}
${decls}
    cout << ${q(RESULT_MARK)};
    __p(${sig.fn}(${argList}));
    cout << '\\n';
  }`
    })
    .join('\n')

  return `${CPP_PREAMBLE}
// ---- your code ----
${userCode}
// ---- runner ----
int main() {
  ios::sync_with_stdio(false);
${calls}
  return 0;
}`
}

// ---------------------------------------------------------------------------
// Design (class) problems
// ---------------------------------------------------------------------------

/**
 * A design problem is driven as a class rather than as a function: construct
 * `design.className` from `args[0]`, then dispatch `ops[i]` on that instance
 * with `args[i]`. One case emits one value — the whole result list — so the
 * existing `judge` compares it against `DesignTestCase.expect` in `exact` mode.
 */
export function buildDesignProgram(
  lang: Lang,
  userCode: string,
  design: DesignSpec,
  tests: DesignTestCase[],
): string {
  return lang === 'js' ? jsDesign(userCode, design, tests) : cppDesign(userCode, design, tests)
}

function jsDesign(userCode: string, design: DesignSpec, tests: DesignTestCase[]): string {
  // Per-method argument builders and result readers, so a method taking a list
  // or returning a tree gets exactly the wrapping a function signature would.
  const lambdas = (params: { type: ParamType }[]) =>
    `[${params.map((p) => `(v) => ${wrapArg('js', p.type, 'v')}`).join(', ')}]`

  const methods = design.methods
    .map(
      (m) =>
        `    ${q(m.name)}: { a: ${lambdas(m.params)}, r: ${
          m.ret === 'void' ? '() => null' : `(r) => ${wrapRet('js', m.ret, 'r')}`
        } },`,
    )
    .join('\n')

  const cases = JSON.stringify(tests.map((t) => ({ ops: t.ops, args: t.args })))

  return `${JS_PREAMBLE}
// ---- your code ----
${userCode}
// ---- runner ----
;(function () {
  const __C = typeof ${design.className} === 'function' ? ${design.className} : null;
  if (!__C) { console.error('Could not find a class named ${design.className}'); return; }
  const __emit = (v) => console.log(${JSON.stringify(RESULT_MARK)} + JSON.stringify(v === undefined ? null : v));
  const __msg = (e) => String((e && e.message) || e);
  const __id = (v) => v;
  const __ctor = ${lambdas(design.ctor)};
  const __M = {
${methods}
  };
  for (const __c of ${cases}) {
    let __obj;
    try {
      __obj = new __C(...(__c.args[0] || []).map((v, i) => (__ctor[i] || __id)(v)));
    } catch (e) {
      __emit({ __error: 'constructor: ' + __msg(e) });
      continue;
    }
    // the constructor contributes null, then every op contributes its return;
    // one throwing op is isolated to its own slot, like a failing test case
    const __out = [null];
    for (let __i = 1; __i < __c.ops.length; __i++) {
      const __spec = __M[__c.ops[__i]];
      try {
        if (!__spec) throw new Error('no method named ' + __c.ops[__i]);
        const __a = (__c.args[__i] || []).map((v, k) => (__spec.a[k] || __id)(v));
        const __r = __obj[__c.ops[__i]](...__a);
        __out.push(__spec.r(__r === undefined ? null : __r));
      } catch (e) {
        __out.push({ __error: __msg(e) });
      }
    }
    __emit(__out);
  }
})();`
}

function cppDesign(userCode: string, design: DesignSpec, tests: DesignTestCase[]): string {
  // The if-chain over `design.methods` resolves at generation time: each op is
  // a typed call, and C++ has no way to pick one at runtime when the branches
  // take different argument types.
  const byName = new Map(design.methods.map((m) => [m.name, m]))

  const cases = tests
    .map((t, ti) => {
      const ctorArgs = design.ctor.map((p, i) => cppLiteral(p.type, t.args[0]?.[i])).join(', ')
      const decl = design.ctor.length
        ? `${design.className} obj(${ctorArgs});`
        : `${design.className} obj;`

      const calls = t.ops
        .slice(1)
        .map((op, k) => {
          const m = byName.get(op)
          if (!m) return `    cout << R"(,{"__error":"no method named ${op}"})";`
          const args = m.params.map((p, i) => cppLiteral(p.type, t.args[k + 1]?.[i])).join(', ')
          const call = `obj.${m.name}(${args})`
          return m.ret === 'void'
            ? `    ${call}; cout << ",null";`
            : `    cout << ','; __p(${call});`
        })
        .join('\n')

      return `  { // case ${ti + 1}
    ${decl}
    cout << ${q(RESULT_MARK)} << "[null";
${calls}
    cout << "]\\n";
  }`
    })
    .join('\n')

  return `${CPP_PREAMBLE}
// ---- your code ----
${userCode}
// ---- runner ----
int main() {
  ios::sync_with_stdio(false);
${cases}
  return 0;
}`
}

// ---------------------------------------------------------------------------
// Judging
// ---------------------------------------------------------------------------

const canon = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(canon)
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, x]) => [k, canon(x)]),
    )
  }
  return v
}

const byJson = (a: unknown, b: unknown) =>
  JSON.stringify(a).localeCompare(JSON.stringify(b))

/**
 * `set`: nothing anywhere carries order, so every level is sorted. Right for a
 * list of 3Sum triplets or anagram groups, where the group is a set too.
 */
const sortDeep = (v: unknown): unknown => {
  if (!Array.isArray(v)) return canon(v)
  return [...v.map(sortDeep)].sort(byJson)
}

/**
 * `sorted`: only the outer list is unordered; each element keeps its own
 * order. An interval is [start, end] and a cell is [row, col], so sorting
 * inside them would pass answers that are simply wrong.
 */
const sortOuter = (v: unknown): unknown => {
  if (!Array.isArray(v)) return canon(v)
  return [...v.map(canon)].sort(byJson)
}

const NORM = { exact: canon, sorted: sortOuter, set: sortDeep } as const

export function judge(actual: unknown, expected: unknown, mode: 'exact' | 'sorted' | 'set' = 'exact'): boolean {
  if (actual && typeof actual === 'object' && '__error' in (actual as object)) return false
  const norm = NORM[mode] ?? canon
  return JSON.stringify(norm(actual)) === JSON.stringify(norm(expected))
}

/** Splits raw program output into result lines and everything the learner printed. */
export function partitionOutput(lines: string[]): { results: unknown[]; stdout: string[] } {
  const results: unknown[] = []
  const stdout: string[] = []
  for (const line of lines) {
    const at = line.indexOf(RESULT_MARK)
    if (at === -1) {
      stdout.push(line)
      continue
    }
    if (at > 0) stdout.push(line.slice(0, at))
    try {
      results.push(JSON.parse(line.slice(at + RESULT_MARK.length)))
    } catch {
      results.push({ __error: 'unparseable result' })
    }
  }
  return { results, stdout }
}

export function prettyValue(v: unknown): string {
  if (v === undefined) return 'undefined'
  return JSON.stringify(v)
}
