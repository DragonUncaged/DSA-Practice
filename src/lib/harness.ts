/**
 * Turns a problem signature + its test cases into runnable source for each
 * language, so the same test table drives JS, Python and C++ without any
 * per-problem harness code.
 *
 * Layout of a generated program is always: preamble → user code → runner.
 * Putting user code after the preamble means a learner who defines their own
 * ListNode/TreeNode simply shadows ours instead of colliding with it.
 */

import type { Lang, ParamType, Signature, TestCase } from './types'

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
// Python
// ---------------------------------------------------------------------------

const PY_PREAMBLE = `
import json as __json
from collections import deque as __deque

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def __to_list(a):
    head = None
    for v in reversed(a):
        head = ListNode(v, head)
    return head

def __to_cycle(pair):
    vals, pos = pair
    head = __to_list(vals)
    if pos >= 0 and head is not None:
        tail = head
        while tail.next is not None:
            tail = tail.next
        target = head
        for _ in range(pos):
            target = target.next
        tail.next = target
    return head

def __from_list(h):
    out, guard = [], 0
    while h is not None and guard < 10000:
        out.append(h.val); h = h.next; guard += 1
    return out

def __to_tree(a):
    if not a or a[0] is None:
        return None
    root = TreeNode(a[0]); q = __deque([root]); i = 1
    while q and i < len(a):
        n = q.popleft()
        if i < len(a):
            v = a[i]; i += 1
            if v is not None:
                n.left = TreeNode(v); q.append(n.left)
        if i < len(a):
            v = a[i]; i += 1
            if v is not None:
                n.right = TreeNode(v); q.append(n.right)
    return root

def __from_tree(r):
    if r is None:
        return []
    out, q = [], __deque([r])
    while q:
        n = q.popleft()
        if n is None:
            out.append(None); continue
        out.append(n.val); q.append(n.left); q.append(n.right)
    while out and out[-1] is None:
        out.pop()
    return out
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

static void __p(int x) { cout << x; }
static void __p(long long x) { cout << x; }
static void __p(bool x) { cout << (x ? "true" : "false"); }
static void __p(double x) { cout << x; }
static void __p(char c) { cout << '"' << c << '"'; }
static void __p(const string& s) { cout << '"' << s << '"'; }
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
        .map((r) => `{${r.map((c) => `'${c}'`).join(',')}}`)
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

/** JS/Python argument expression: wraps raw JSON in a structure builder when needed. */
function wrapArg(lang: 'js' | 'py', type: ParamType, json: string): string {
  if (type === 'list') return lang === 'js' ? `__toList(${json})` : `__to_list(${json})`
  if (type === 'list[]')
    return lang === 'js' ? `(${json}).map(__toList)` : `[__to_list(__x) for __x in ${json}]`
  if (type === 'cycle') return lang === 'js' ? `__toCycle(${json})` : `__to_cycle(${json})`
  if (type === 'tree') return lang === 'js' ? `__toTree(${json})` : `__to_tree(${json})`
  return json
}

function wrapRet(lang: 'js' | 'py', type: ParamType, expr: string): string {
  if (type === 'list') return lang === 'js' ? `__fromList(${expr})` : `__from_list(${expr})`
  if (type === 'tree') return lang === 'js' ? `__fromTree(${expr})` : `__from_tree(${expr})`
  return expr
}

// ---------------------------------------------------------------------------
// Program builders
// ---------------------------------------------------------------------------

const pyJson = (v: unknown) =>
  JSON.stringify(v).replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False').replace(/\bnull\b/g, 'None')

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

  if (lang === 'py') {
    const calls = tests
      .map((t) => {
        const args = sig.params.map((p, i) => wrapArg('py', p.type, pyJson(t.args[i]))).join(', ')
        return `    try:
        __emit(${wrapRet('py', sig.ret, `__fn(${args})`)})
    except Exception as __e:
        __fail(__e)`
      })
      .join('\n')

    return `${PY_PREAMBLE}
# ---- your code ----
${userCode}
# ---- runner ----
def __run():
    __fn = globals().get(${q(sig.fn)})
    if __fn is None and 'Solution' in globals():
        __fn = getattr(globals()['Solution'](), ${q(sig.fn)}, None)
    if __fn is None:
        import sys; print('Could not find a function named ${sig.fn}(...)', file=sys.stderr); return
    def __emit(v):
        print(${q(RESULT_MARK)} + __json.dumps(v, default=str))
    def __fail(e):
        print(${q(RESULT_MARK)} + __json.dumps({'__error': str(e)}))
${calls}

__run()`
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

const sortDeep = (v: unknown): unknown => {
  if (!Array.isArray(v)) return canon(v)
  const inner = v.map(sortDeep)
  return [...inner].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}

export function judge(actual: unknown, expected: unknown, mode: 'exact' | 'sorted' | 'set' = 'exact'): boolean {
  if (actual && typeof actual === 'object' && '__error' in (actual as object)) return false
  const norm = mode === 'exact' ? canon : sortDeep
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
