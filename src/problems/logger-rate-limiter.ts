import type { Problem } from '@/lib/types'

export const loggerRateLimiter: Problem = {
  id: 'logger-rate-limiter',
  title: 'Logger Rate Limiter',
  group: 'Easy',
  pattern: 'Design',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/logger-rate-limiter/',
  statement:
    'Design a `Logger` whose `shouldPrintMessage(timestamp, message)` returns true only when that exact message has not been printed in the last 10 seconds. Timestamps arrive in non-decreasing order. A map from message to the next timestamp it is allowed at answers each call in `O(1)`.',
  constraints: [
    '0 <= timestamp <= 10^9',
    'Timestamps arrive in non-decreasing order',
    '1 <= message.length <= 30',
    'At most 10^4 calls are made to shouldPrintMessage',
  ],

  design: {
    className: 'Logger',
    ctor: [],
    methods: [
      {
        name: 'shouldPrintMessage',
        params: [
          { name: 'timestamp', type: 'int' },
          { name: 'message', type: 'string' },
        ],
        ret: 'bool',
      },
    ],
  },

  designTests: [
    {
      ops: [
        'Logger',
        'shouldPrintMessage',
        'shouldPrintMessage',
        'shouldPrintMessage',
        'shouldPrintMessage',
        'shouldPrintMessage',
        'shouldPrintMessage',
      ],
      args: [[], [1, 'foo'], [2, 'bar'], [3, 'foo'], [8, 'bar'], [10, 'foo'], [11, 'foo']],
      expect: [null, true, true, false, false, false, true],
    },
    // a blocked attempt does not restart the ten-second window
    {
      ops: ['Logger', 'shouldPrintMessage', 'shouldPrintMessage', 'shouldPrintMessage'],
      args: [[], [0, 'a'], [9, 'a'], [10, 'a']],
      expect: [null, true, false, true],
    },
    // the same timestamp twice, different messages
    {
      ops: ['Logger', 'shouldPrintMessage', 'shouldPrintMessage', 'shouldPrintMessage'],
      args: [[], [5, 'x'], [5, 'y'], [5, 'x']],
      expect: [null, true, true, false],
    },
    {
      ops: ['Logger', 'shouldPrintMessage', 'shouldPrintMessage'],
      args: [[], [1000000000, 'end'], [1000000000, 'end']],
      expect: [null, true, false],
    },
  ],

  starter: {
    js: `class Logger {
  constructor() {
  }

  shouldPrintMessage(timestamp, message) {
    // timestamp: number, message: string  ->  boolean
  }
}
`,
    cpp: `class Logger {
public:
    Logger() {
    }

    bool shouldPrintMessage(int timestamp, string message) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'scan-history',
      label: 'Keep every printed message and scan the recent ones',
      kind: 'brute',
      time: 'O(n) per call',
      space: 'O(n)',
      blurb:
        'Record every message that was printed with its timestamp, and on each call scan that history for the same message inside the last ten seconds. Correct, but the log only grows, and every call rereads all of it.',
      code: {
        cpp: {
          lines: [
            'class Logger {',
            '    vector<pair<int, string>> printed;',
            '',
            'public:',
            '    Logger() {}',
            '',
            '    bool shouldPrintMessage(int timestamp, string message) {',
            '        for (auto& [t, m] : printed)',
            '            if (m == message && t > timestamp - 10) return false;',
            '        printed.push_back({timestamp, message});',
            '        return true;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class Logger {',
            '  constructor() {',
            '    this.printed = [];',
            '  }',
            '',
            '  shouldPrintMessage(timestamp, message) {',
            '    for (const [t, m] of this.printed) {',
            '      if (m === message && t > timestamp - 10) return false;',
            '    }',
            '    this.printed.push([timestamp, message]);',
            '    return true;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (number | string)[][]], c) {
        const printed: [number, string][] = []
        const out: (boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'shouldPrintMessage') {
            out.push(null)
            continue
          }
          const [timestamp, message] = args[i] as [number, string]
          let blocked = false
          for (const [t, m] of printed) {
            c.ops++
            if (m === message && t > timestamp - 10) {
              blocked = true
              break
            }
          }
          if (!blocked) printed.push([timestamp, message])
          out.push(!blocked)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'next-allowed',
      label: 'Map each message to the next time it may print',
      kind: 'optimal',
      time: 'O(1) per call',
      space: 'O(distinct messages)',
      blurb:
        'Only the most recent print of each message matters, so store one number per message: the timestamp from which it is allowed again. A call prints when the message is unknown or that time has arrived, and then moves the bar ten seconds ahead. One hash lookup per call.',
      code: {
        cpp: {
          lines: [
            'class Logger {',
            '    unordered_map<string, int> allowedAt;',
            '',
            'public:',
            '    Logger() {}',
            '',
            '    bool shouldPrintMessage(int timestamp, string message) {',
            '        auto it = allowedAt.find(message);',
            '        if (it != allowedAt.end() && timestamp < it->second) return false;',
            '        allowedAt[message] = timestamp + 10;',
            '        return true;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class Logger {',
            '  constructor() {',
            '    this.allowedAt = new Map();',
            '  }',
            '',
            '  shouldPrintMessage(timestamp, message) {',
            '    if (this.allowedAt.has(message) && timestamp < this.allowedAt.get(message)) return false;',
            '    this.allowedAt.set(message, timestamp + 10);',
            '    return true;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (number | string)[][]], c) {
        const allowedAt = new Map<string, number>()
        const out: (boolean | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'shouldPrintMessage') {
            out.push(null)
            continue
          }
          c.ops++
          const [timestamp, message] = args[i] as [number, string]
          if (allowedAt.has(message) && timestamp < allowedAt.get(message)!) {
            out.push(false)
            continue
          }
          allowedAt.set(message, timestamp + 10)
          out.push(true)
        }
        return out
      },
    },
  ],
}
