import type { Problem } from '@/lib/types'

/**
 * Adapted for the runner the same way as the first version: the `Reader` is
 * constructed with the file, `read4` is provided on it, and each `read(n)`
 * returns the characters it read as a string.
 */
export const readNCharactersGivenRead4II: Problem = {
  id: 'read-n-characters-given-read4-ii-call-multiple-times',
  title: 'Read N Characters Given read4 II - Call Multiple Times',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode:
    'https://leetcode.com/problems/read-n-characters-given-read4-ii-call-multiple-times/',
  statement:
    'Same `read4(buf4)` API as the first version, but now `read(n)` may be called many times on the same file. `read4` always hands back four characters, so a call that asks for fewer leaves a remainder that the next call must consume first — the object has to carry a small four-character buffer and an offset into it across calls. As before, the `Reader` is constructed with the file, `read4` is provided, and `read(n)` returns the characters as a string.',
  constraints: [
    '1 <= file.length <= 500',
    'file consists of English letters and digits',
    '1 <= queries.length <= 10',
    '1 <= queries[i] <= 500',
  ],

  design: {
    className: 'Reader',
    ctor: [{ name: 'file', type: 'string' }],
    methods: [{ name: 'read', params: [{ name: 'n', type: 'int' }], ret: 'string' }],
  },

  designTests: [
    { ops: ['Reader', 'read', 'read', 'read'], args: [['abc'], [1], [2], [1]], expect: [null, 'a', 'bc', ''] },
    { ops: ['Reader', 'read', 'read'], args: [['abc'], [4], [1]], expect: [null, 'abc', ''] },
    // the leftover of one read4 spills into the next call
    {
      ops: ['Reader', 'read', 'read', 'read', 'read'],
      args: [['abcdefghij'], [3], [3], [3], [3]],
      expect: [null, 'abc', 'def', 'ghi', 'j'],
    },
    { ops: ['Reader', 'read', 'read'], args: [['abcdefgh'], [8], [1]], expect: [null, 'abcdefgh', ''] },
    { ops: ['Reader', 'read', 'read', 'read'], args: [['ab'], [1], [1], [1]], expect: [null, 'a', 'b', ''] },
    { ops: ['Reader', 'read', 'read'], args: [['abcde'], [2], [500]], expect: [null, 'ab', 'cde'] },
  ],

  starter: {
    js: `class Reader {
  constructor(file) {
    // the file is reachable only through read4 below
    this.file = file;
    this.filePos = 0;
  }

  // Provided: copies up to four characters into buf4 and returns how many it read.
  read4(buf4) {
    let n = 0;
    while (n < 4 && this.filePos < this.file.length) buf4[n++] = this.file[this.filePos++];
    return n;
  }

  read(n) {
    // n: number  ->  string, the characters actually read (at most n)
  }
}
`,
    cpp: `class Reader {
    string file;
    size_t filePos = 0;

public:
    Reader(string file) : file(file) {}

    // Provided: copies up to four characters into buf4 and returns how many it read.
    int read4(char *buf4) {
        int n = 0;
        while (n < 4 && filePos < file.size()) buf4[n++] = file[filePos++];
        return n;
    }

    string read(int n) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'slurp-first',
      label: 'Read the whole file on the first call',
      kind: 'brute',
      time: 'O(file) once, then O(n) per call',
      space: 'O(file)',
      blurb:
        'Sidestep the remainder problem entirely: on the first call, drain the file through `read4` into one big string, and answer every call by slicing from a cursor into it. Correct, and the multi-call complication vanishes — but the whole file sits in memory when only four characters ever needed to.',
      code: {
        cpp: {
          lines: [
            'class Reader {',
            '    string file;',
            '    size_t filePos = 0;',
            '    string all;',
            '    size_t cursor = 0;',
            '    bool loaded = false;',
            '',
            'public:',
            '    Reader(string file) : file(file) {}',
            '',
            '    int read4(char *buf4) {',
            '        int n = 0;',
            '        while (n < 4 && filePos < file.size()) buf4[n++] = file[filePos++];',
            '        return n;',
            '    }',
            '',
            '    string read(int n) {',
            '        if (!loaded) {',
            '            char buf4[4];',
            '            int got;',
            '            do { got = read4(buf4); all.append(buf4, got); } while (got == 4);',
            '            loaded = true;',
            '        }',
            '        string out = all.substr(cursor, n);',
            '        cursor += out.size();',
            '        return out;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class Reader {',
            '  constructor(file) {',
            '    this.file = file;',
            '    this.filePos = 0;',
            '    this.all = null;',
            '    this.cursor = 0;',
            '  }',
            '',
            '  read4(buf4) {',
            '    let n = 0;',
            '    while (n < 4 && this.filePos < this.file.length) buf4[n++] = this.file[this.filePos++];',
            '    return n;',
            '  }',
            '',
            '  read(n) {',
            '    if (this.all === null) {',
            "      this.all = '';",
            '      const buf4 = new Array(4);',
            '      let got;',
            '      do {',
            '        got = this.read4(buf4);',
            "        this.all += buf4.slice(0, got).join('');",
            '      } while (got === 4);',
            '    }',
            '    const out = this.all.slice(this.cursor, this.cursor + n);',
            '    this.cursor += out.length;',
            '    return out;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (string | number)[][]], c) {
        const file = args[0][0] as string
        let filePos = 0
        const read4 = (buf4: string[]) => {
          let n = 0
          while (n < 4 && filePos < file.length) buf4[n++] = file[filePos++]
          c.ops++
          return n
        }
        let all: string | null = null
        let cursor = 0
        const out: (string | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'read') {
            out.push(null)
            continue
          }
          const n = args[i][0] as number
          if (all === null) {
            all = ''
            const buf4: string[] = new Array(4)
            let got
            do {
              got = read4(buf4)
              all += buf4.slice(0, got).join('')
            } while (got === 4)
          }
          const s = all.slice(cursor, cursor + n)
          cursor += s.length
          c.ops += s.length
          out.push(s)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'four-char-buffer',
      label: 'Keep the leftover of the last read4 in a four-slot buffer',
      kind: 'optimal',
      time: 'O(n) per call',
      space: 'O(1)',
      blurb:
        'Only the unconsumed tail of the most recent `read4` needs to survive between calls, and that is at most four characters. Keep that buffer plus an offset into it: hand characters out from the buffer first, refill it with another `read4` when it runs dry, and stop when either `n` is satisfied or `read4` returns nothing.',
      code: {
        cpp: {
          lines: [
            'class Reader {',
            '    string file;',
            '    size_t filePos = 0;',
            '    char buf4[4];',
            '    int bufPos = 0, bufLen = 0;',
            '',
            'public:',
            '    Reader(string file) : file(file) {}',
            '',
            '    int read4(char *buf4) {',
            '        int n = 0;',
            '        while (n < 4 && filePos < file.size()) buf4[n++] = file[filePos++];',
            '        return n;',
            '    }',
            '',
            '    string read(int n) {',
            '        string out;',
            '        while ((int)out.size() < n) {',
            '            if (bufPos == bufLen) {',
            '                bufLen = read4(buf4);',
            '                bufPos = 0;',
            '                if (bufLen == 0) break;',
            '            }',
            '            out += buf4[bufPos++];',
            '        }',
            '        return out;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class Reader {',
            '  constructor(file) {',
            '    this.file = file;',
            '    this.filePos = 0;',
            '    this.buf4 = new Array(4);',
            '    this.bufPos = 0;',
            '    this.bufLen = 0;',
            '  }',
            '',
            '  read4(buf4) {',
            '    let n = 0;',
            '    while (n < 4 && this.filePos < this.file.length) buf4[n++] = this.file[this.filePos++];',
            '    return n;',
            '  }',
            '',
            '  read(n) {',
            "    let out = '';",
            '    while (out.length < n) {',
            '      if (this.bufPos === this.bufLen) {',
            '        this.bufLen = this.read4(this.buf4);',
            '        this.bufPos = 0;',
            '        if (this.bufLen === 0) break;',
            '      }',
            '      out += this.buf4[this.bufPos++];',
            '    }',
            '    return out;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (string | number)[][]], c) {
        const file = args[0][0] as string
        let filePos = 0
        const buf4: string[] = new Array(4)
        let bufPos = 0
        let bufLen = 0
        const read4 = () => {
          let n = 0
          while (n < 4 && filePos < file.length) buf4[n++] = file[filePos++]
          c.ops++
          return n
        }
        const out: (string | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'read') {
            out.push(null)
            continue
          }
          const n = args[i][0] as number
          let s = ''
          while (s.length < n) {
            if (bufPos === bufLen) {
              bufLen = read4()
              bufPos = 0
              if (bufLen === 0) break
            }
            c.ops++
            s += buf4[bufPos++]
          }
          out.push(s)
        }
        return out
      },
    },
  ],
}
