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
      id: 'settle-first-debt',
      label: 'Settle the first open balance every way',
      kind: 'optimal',
      time: 'O(n!)',
      space: 'O(n)',
      blurb:
        'Who paid whom stops mattering the moment you reduce everyone to a single net balance — the question becomes zeroing out a list of numbers that already sums to zero. Take the first non-zero balance and try pouring it into each opposite-signed balance in turn; one transfer is spent either way, so the search only has to find the shortest chain.',
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
  ],
}
