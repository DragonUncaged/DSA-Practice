import type { Problem } from '@/lib/types'

/**
 * Adapted for the runner: the class is constructed with the file's contents,
 * which are reachable only through the provided `read4`, and `read(n)` returns
 * the characters it read as a string so the tests can check them.
 */
export const readNCharactersGivenRead4: Problem = {
  id: 'read-n-characters-given-read4',
  title: 'Read N Characters Given Read4',
  group: 'Easy',
  pattern: 'Design',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/read-n-characters-given-read4/',
  statement:
    'You may only touch a file through `read4(buf4)`, which copies up to four characters into `buf4` and returns how many it actually read. Implement `read(n)`, which reads up to `n` characters from the file and returns them. `read` is called only once per file, so a short `read4` means end of file and you can stop. Here the `Reader` is constructed with the file and `read4` is provided on it; `read(n)` returns the characters as a string.',
  constraints: [
    '1 <= file.length <= 500',
    'file consists of English letters and digits',
    '1 <= n <= 1000',
    'read is called exactly once',
  ],

  design: {
    className: 'Reader',
    ctor: [{ name: 'file', type: 'string' }],
    methods: [{ name: 'read', params: [{ name: 'n', type: 'int' }], ret: 'string' }],
  },

  designTests: [
    { ops: ['Reader', 'read'], args: [['abc'], [4]], expect: [null, 'abc'] },
    { ops: ['Reader', 'read'], args: [['abcde'], [5]], expect: [null, 'abcde'] },
    { ops: ['Reader', 'read'], args: [['abcdABCD1234'], [12]], expect: [null, 'abcdABCD1234'] },
    { ops: ['Reader', 'read'], args: [['leetcode'], [5]], expect: [null, 'leetc'] },
    // n far beyond the file: stop at the first short read4
    { ops: ['Reader', 'read'], args: [['ab'], [1000]], expect: [null, 'ab'] },
    // a file that is an exact multiple of four
    { ops: ['Reader', 'read'], args: [['abcdefgh'], [8]], expect: [null, 'abcdefgh'] },
    { ops: ['Reader', 'read'], args: [['x'], [1]], expect: [null, 'x'] },
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
      id: 'read4-loop',
      label: 'Call read4 until n is reached or the file ends',
      kind: 'optimal',
      time: 'O(n)',
      space: 'O(1)',
      blurb:
        'There is only one shape of answer: keep calling `read4` and copy what comes back, stopping when `n` characters are in hand or a call returns fewer than four — the end of the file. The one care point is the last chunk, which may hold more characters than `n` still wants; copy only up to `n`.',
      code: {
        cpp: {
          lines: [
            'class Reader {',
            '    string file;',
            '    size_t filePos = 0;',
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
            '        char buf4[4];',
            '        while ((int)out.size() < n) {',
            '            int got = read4(buf4);',
            '            for (int i = 0; i < got && (int)out.size() < n; ++i) out += buf4[i];',
            '            if (got < 4) break;',
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
            '  }',
            '',
            '  read4(buf4) {',
            '    let n = 0;',
            '    while (n < 4 && this.filePos < this.file.length) buf4[n++] = this.file[this.filePos++];',
            '    return n;',
            '  }',
            '',
            '  read(n) {',
            '    const buf4 = new Array(4);',
            "    let out = '';",
            '    while (out.length < n) {',
            '      const got = this.read4(buf4);',
            '      for (let i = 0; i < got && out.length < n; i++) out += buf4[i];',
            '      if (got < 4) break;',
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
        const read4 = (buf4: string[]) => {
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
          const buf4: string[] = new Array(4)
          let s = ''
          while (s.length < n) {
            const got = read4(buf4)
            for (let k = 0; k < got && s.length < n; k++) s += buf4[k]
            if (got < 4) break
          }
          out.push(s)
        }
        return out
      },
    },
  ],
}
