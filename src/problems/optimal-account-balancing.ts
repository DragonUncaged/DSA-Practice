import type { Problem } from '@/lib/types'

export const optimalAccountBalancing: Problem = {
  id: 'optimal-account-balancing',
  title: 'Optimal Account Balancing',
  group: 'Hard',
  pattern: 'Backtracking',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/optimal-account-balancing/',
  statement:
    'Each entry of `transactions` is `[from, to, amount]`, meaning `from` gave `amount` to `to`. Return the smallest number of transfers that settles everybody up.',
  constraints: [
    '1 <= transactions.length <= 8',
    'transactions[i].length == 3',
    '0 <= from, to < 12 and from != to',
    '1 <= amount <= 100',
  ],
  signature: {
    fn: 'minTransfers',
    params: [{ name: 'transactions', type: 'int[][]' }],
    ret: 'int',
  },
  tests: [
    { args: [[[0, 1, 10], [2, 0, 5]]], expect: 2 },
    { args: [[[0, 1, 10], [1, 0, 1], [1, 2, 5], [2, 0, 5]]], expect: 1 },
    { args: [[[0, 1, 1]]], expect: 1, note: 'one debt, one transfer' },
    { args: [[[0, 1, 5], [1, 2, 5]]], expect: 1, note: 'the middle person nets out' },
    {
      args: [[[0, 1, 10], [2, 3, 10]]],
      expect: 2,
      note: 'two independent pairs cannot be merged',
    },
    { args: [[[0, 1, 5], [1, 0, 5]]], expect: 0, note: 'already settled' },
    { args: [[[0, 1, 3], [2, 3, 3], [4, 5, 3], [6, 7, 3]]], expect: 4, note: 'four independent pairs' },
    {
      args: [[[0, 1, 4], [2, 3, 4], [4, 5, 4], [6, 7, 4], [8, 9, 4], [10, 11, 4], [0, 2, 1], [1, 3, 1]]],
      expect: 6,
      note: 'twelve people, the most allowed',
    },
    { args: [[[0, 1, 1], [1, 2, 2], [2, 3, 3], [3, 4, 4]]], expect: 4 },
  ],
  demo: [[[0, 1, 10], [2, 0, 5]]],
  starter: {
    js: `function minTransfers(transactions) {
  // transactions: number[][]  ->  number
}
`,
    cpp: `int minTransfers(vector<vector<int>>& transactions) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'every-pair',
      label: 'Try every transfer between any two people',
      kind: 'brute',
      time: 'O((k^2)^k)',
      space: 'O(k)',
      blurb:
        'Reduce everyone to a net balance, then at each step pick any two people with opposite balances, move the smaller amount from one to the other, and recurse until every balance is zero. Correct, but the same pair of transfers is explored in every order, so the search tree is enormous even for a dozen people.',
      code: {
        cpp: {
          lines: [
            'int minTransfers(vector<vector<int>>& transactions) {',
            '    unordered_map<int, int> net;',
            '    for (auto& t : transactions) { net[t[0]] -= t[2]; net[t[1]] += t[2]; }',
            '    vector<int> debts;',
            '    for (auto& [who, v] : net) if (v != 0) debts.push_back(v);',
            '    int k = debts.size();',
            '    function<int()> settle = [&]() {',
            '        int best = INT_MAX;',
            '        bool any = false;',
            '        for (int i = 0; i < k; ++i) for (int j = 0; j < k; ++j) {',
            '            if (debts[i] >= 0 || debts[j] <= 0) continue;',
            '            any = true;',
            '            int amount = min(-debts[i], debts[j]);',
            '            debts[i] += amount; debts[j] -= amount;',
            '            best = min(best, 1 + settle());',
            '            debts[i] -= amount; debts[j] += amount;',
            '        }',
            '        return any ? best : 0;',
            '    };',
            '    return settle();',
            '}',
          ],
        },
        js: {
          lines: [
            'function minTransfers(transactions) {',
            '  const net = new Map();',
            '  for (const [from, to, amount] of transactions) {',
            '    net.set(from, (net.get(from) ?? 0) - amount);',
            '    net.set(to, (net.get(to) ?? 0) + amount);',
            '  }',
            '  const debts = [...net.values()].filter((v) => v !== 0);',
            '',
            '  const settle = () => {',
            '    let best = Infinity;',
            '    let any = false;',
            '    for (let i = 0; i < debts.length; i++) {',
            '      for (let j = 0; j < debts.length; j++) {',
            '        if (debts[i] >= 0 || debts[j] <= 0) continue;',
            '        any = true;',
            '        const amount = Math.min(-debts[i], debts[j]);',
            '        debts[i] += amount; debts[j] -= amount;',
            '        best = Math.min(best, 1 + settle());',
            '        debts[i] -= amount; debts[j] += amount;',
            '      }',
            '    }',
            '    return any ? best : 0;',
            '  };',
            '  return settle();',
            '}',
          ],
        },
      },

      run([transactions]: [number[][]], c) {
        const net = new Map<number, number>()
        for (const [from, to, amount] of transactions) {
          net.set(from, (net.get(from) ?? 0) - amount)
          net.set(to, (net.get(to) ?? 0) + amount)
        }
        const debts = [...net.values()].filter((v) => v !== 0)
        if (debts.length > 7) throw new Error('too slow')
        const settle = (): number => {
          let best = Infinity
          let any = false
          for (let i = 0; i < debts.length; i++) {
            for (let j = 0; j < debts.length; j++) {
              c.ops++
              if (debts[i] >= 0 || debts[j] <= 0) continue
              any = true
              const amount = Math.min(-debts[i], debts[j])
              debts[i] += amount
              debts[j] -= amount
              best = Math.min(best, 1 + settle())
              debts[i] -= amount
              debts[j] += amount
            }
          }
          return any ? best : 0
        }
        return settle()
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'settle-first-debt',
      label: 'Settle the first open balance every way',
      kind: 'better',
      time: 'O(n!)',
      space: 'O(n)',
      blurb:
        'Most of those orders are the same set of transfers shuffled. Fix the order: always settle the first open balance, and only choose whom it settles with. Pouring it into each opposite-signed balance in turn spends one transfer either way, so the search only has to find the shortest chain — a factorial tree instead of a doubly exponential one.',
      code: {
        cpp: {
          lines: [
            'int minTransfers(vector<vector<int>>& transactions) {',
            '    unordered_map<int, long long> net;',
            '    for (auto& t : transactions) {',
            '        net[t[0]] -= t[2];',
            '        net[t[1]] += t[2];',
            '    }',
            '',
            '    vector<long long> debts;',
            '    for (auto& [who, amount] : net) if (amount) debts.push_back(amount);',
            '',
            '    function<int(int)> settle = [&](int start) {',
            '        while (start < (int)debts.size() && debts[start] == 0) ++start;',
            '        if (start == (int)debts.size()) return 0;',
            '',
            '        int best = INT_MAX;',
            '        for (int i = start + 1; i < (int)debts.size(); ++i) {',
            '            if (debts[i] * debts[start] >= 0) continue;',
            '            debts[i] += debts[start];',
            '            best = min(best, 1 + settle(start + 1));',
            '            debts[i] -= debts[start];',
            '        }',
            '        return best;',
            '    };',
            '',
            '    return settle(0);',
            '}',
          ],
        },
        js: {
          lines: [
            'function minTransfers(transactions) {',
            '  const net = new Map();',
            '  for (const [from, to, amount] of transactions) {',
            '    net.set(from, (net.get(from) ?? 0) - amount);',
            '    net.set(to, (net.get(to) ?? 0) + amount);',
            '  }',
            '',
            '  const debts = [...net.values()].filter((v) => v !== 0);',
            '',
            '  const settle = (start) => {',
            '    while (start < debts.length && debts[start] === 0) start++;',
            '    if (start === debts.length) return 0;',
            '',
            '    let best = Infinity;',
            '    for (let i = start + 1; i < debts.length; i++) {',
            '      if (debts[i] * debts[start] >= 0) continue;',
            '      debts[i] += debts[start];',
            '      best = Math.min(best, 1 + settle(start + 1));',
            '      debts[i] -= debts[start];',
            '    }',
            '    return best;',
            '  };',
            '',
            '  return settle(0);',
            '}',
          ],
        },
      },

      run([transactions]: [number[][]], c) {
        const net = new Map<number, number>()
        for (const [from, to, amount] of transactions) {
          net.set(from, (net.get(from) ?? 0) - amount)
          net.set(to, (net.get(to) ?? 0) + amount)
        }
        const debts = [...net.values()].filter((v) => v !== 0)
        const settle = (start: number): number => {
          c.ops++
          while (start < debts.length && debts[start] === 0) start++
          if (start === debts.length) return 0
          let best = Infinity
          for (let i = start + 1; i < debts.length; i++) {
            if (debts[i] * debts[start] >= 0) continue
            debts[i] += debts[start]
            best = Math.min(best, 1 + settle(start + 1))
            debts[i] -= debts[start]
          }
          return best
        }
        return settle(0)
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'subset-dp',
      label: 'Count the zero-sum groups with a subset DP',
      kind: 'optimal',
      time: 'O(2^k * k)',
      space: 'O(2^k)',
      blurb:
        'A group of `g` people whose balances sum to zero can always be settled in `g - 1` transfers, and never fewer — so the answer is the number of non-zero balances minus the largest number of disjoint zero-sum groups they split into. With at most twelve people that is a bitmask DP: `dp[mask]` is the best split of `mask`, one more than the best split of `mask` minus any member whenever `mask` itself sums to zero.',
      code: {
        cpp: {
          lines: [
            'int minTransfers(vector<vector<int>>& transactions) {',
            '    unordered_map<int, int> net;',
            '    for (auto& t : transactions) { net[t[0]] -= t[2]; net[t[1]] += t[2]; }',
            '    vector<int> debts;',
            '    for (auto& [who, v] : net) if (v != 0) debts.push_back(v);',
            '    int k = debts.size();',
            '    vector<int> sum(1 << k, 0), dp(1 << k, 0);',
            '    for (int mask = 1; mask < (1 << k); ++mask) {',
            '        int low = __builtin_ctz(mask);',
            '        sum[mask] = sum[mask ^ (1 << low)] + debts[low];',
            '        for (int i = 0; i < k; ++i)',
            '            if (mask & (1 << i)) dp[mask] = max(dp[mask], dp[mask ^ (1 << i)]);',
            '        if (sum[mask] == 0) dp[mask]++;',
            '    }',
            '    return k - dp[(1 << k) - 1];',
            '}',
          ],
        },
        js: {
          lines: [
            'function minTransfers(transactions) {',
            '  const net = new Map();',
            '  for (const [from, to, amount] of transactions) {',
            '    net.set(from, (net.get(from) ?? 0) - amount);',
            '    net.set(to, (net.get(to) ?? 0) + amount);',
            '  }',
            '  const debts = [...net.values()].filter((v) => v !== 0);',
            '  const k = debts.length;',
            '',
            '  const sum = new Array(1 << k).fill(0);',
            '  const dp = new Array(1 << k).fill(0); // most disjoint zero-sum groups inside mask',
            '  for (let mask = 1; mask < 1 << k; mask++) {',
            '    const low = 31 - Math.clz32(mask & -mask);',
            '    sum[mask] = sum[mask ^ (1 << low)] + debts[low];',
            '    for (let i = 0; i < k; i++) {',
            '      if (mask & (1 << i)) dp[mask] = Math.max(dp[mask], dp[mask ^ (1 << i)]);',
            '    }',
            '    if (sum[mask] === 0) dp[mask]++;',
            '  }',
            '  return k - dp[(1 << k) - 1];',
            '}',
          ],
        },
      },

      run([transactions]: [number[][]], c) {
        const net = new Map<number, number>()
        for (const [from, to, amount] of transactions) {
          net.set(from, (net.get(from) ?? 0) - amount)
          net.set(to, (net.get(to) ?? 0) + amount)
        }
        const debts = [...net.values()].filter((v) => v !== 0)
        const k = debts.length
        const sum = new Array<number>(1 << k).fill(0)
        const dp = new Array<number>(1 << k).fill(0)
        for (let mask = 1; mask < 1 << k; mask++) {
          const low = 31 - Math.clz32(mask & -mask)
          sum[mask] = sum[mask ^ (1 << low)] + debts[low]
          for (let i = 0; i < k; i++) {
            c.ops++
            if (mask & (1 << i)) dp[mask] = Math.max(dp[mask], dp[mask ^ (1 << i)])
          }
          if (sum[mask] === 0) dp[mask]++
        }
        return k - dp[(1 << k) - 1]
      },
    },
  ],
}
