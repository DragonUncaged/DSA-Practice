import type { Problem } from '@/lib/types'

export const studentAttendanceRecordI: Problem = {
  id: 'student-attendance-record-i',
  title: 'Student Attendance Record I',
  group: 'String',
  pattern: 'Running Count',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/student-attendance-record-i/',
  statement:
    'An attendance record `s` uses `A` for absent, `L` for late and `P` for present. A student is rewardable when the record holds fewer than two `A`s in total and never three or more consecutive `L`s. Return `true` if the student is rewardable.',
  constraints: ['1 <= s.length <= 1000', 's contains only the characters A, L and P'],
  signature: { fn: 'checkRecord', params: [{ name: 's', type: 'string' }], ret: 'bool' },
  tests: [
    { args: ['PPALLP'], expect: true },
    { args: ['PPALLL'], expect: false, note: 'three lates in a row' },
    { args: ['A'], expect: true, note: 'one absence is still fine' },
    { args: ['AA'], expect: false },
    { args: ['LLL'], expect: false },
    { args: ['ALLAPLL'], expect: false, note: 'two absences, wherever they sit' },
  ],
  demo: ['PPALLP'],
  scale: (n) => ['PL'.repeat(Math.max(1, n >> 1))],
  starter: {
    js: `function checkRecord(s) {
  // s: string  ->  boolean
}
`,
    cpp: `bool checkRecord(string s) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'two-counters',
      label: 'One total, one run length',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'The two rules need different kinds of memory: absences are a total that never resets, lates are a run that resets on anything else. Keep both counters and bail out the moment either crosses its limit — there is nothing later in the string that could redeem it.',
      code: {
        cpp: {
          lines: [
            'bool checkRecord(string s) {',
            '    int absent = 0, late = 0;',
            '    for (char ch : s) {',
            '        if (ch == \'A\' && ++absent >= 2) return false;',
            '        late = ch == \'L\' ? late + 1 : 0;',
            '        if (late >= 3) return false;',
            '    }',
            '    return true;',
            '}',
          ],
        },
        js: {
          lines: [
            'function checkRecord(s) {',
            '  let absent = 0, late = 0;',
            '  for (const ch of s) {',
            '    if (ch === "A" && ++absent >= 2) return false;',
            '    late = ch === "L" ? late + 1 : 0;',
            '    if (late >= 3) return false;',
            '  }',
            '  return true;',
            '}',
          ],
        },
      },

      run([s]: [string], c) {
        let absent = 0
        let late = 0
        for (const ch of s) {
          c.ops++
          if (ch === 'A' && ++absent >= 2) return false
          late = ch === 'L' ? late + 1 : 0
          if (late >= 3) return false
        }
        return true
      },
    },
  ],
}
