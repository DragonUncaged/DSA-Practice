import type { Problem } from '@/lib/types'

export const similarRgbColor: Problem = {
  id: 'similar-rgb-color',
  title: 'Similar RGB Color',
  group: 'String',
  pattern: 'Per-channel Rounding',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/similar-rgb-color/',
  statement:
    'A colour is written `"#AABBCC"`. A colour is *shorthand* when each channel has two equal hex digits, i.e. it can be written `"#ABC"`. Similarity between two colours is `-(AB - XY)^2` summed over the three channels. Given `color`, return the shorthand colour most similar to it, in full six-digit form.',
  constraints: [
    'color is exactly 7 characters: "#" then six lowercase hex digits',
    'The answer must itself be shorthand — each channel is two equal digits',
  ],
  signature: { fn: 'similarRGB', params: [{ name: 'color', type: 'string' }], ret: 'string' },
  tests: [
    { args: ['#09f166'], expect: '#11ee66' },
    { args: ['#4e3fd1'], expect: '#5544cc' },
    { args: ['#000000'], expect: '#000000', note: 'already shorthand' },
    { args: ['#ffffff'], expect: '#ffffff' },
    { args: ['#010101'], expect: '#000000', note: 'just above a shorthand value rounds down' },
    { args: ['#0f0f0f'], expect: '#111111', note: 'just below one rounds up' },
    { args: ['#fefefe'], expect: '#ffffff' },
    { args: ['#808080'], expect: '#888888', note: '0x80 is 128, closer to 136 than to 119' },
    { args: ['#1a2b3c'], expect: '#223344' },
  ],
  demo: ['#09f166'],
  starter: {
    js: `function similarRGB(color) {
  // color: string  ->  string
}
`,
    cpp: `string similarRGB(string color) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'enumerate',
      label: 'Try all 4096 shorthand colours',
      kind: 'brute',
      time: 'O(16^3)',
      space: 'O(1)',
      blurb:
        'There are only sixteen choices per channel, so every shorthand colour can be written out — 4096 of them. Score each against the input with the similarity formula and keep the best. It is a constant amount of work, but a large constant, and it never notices that the three channels have nothing to do with each other.',
      code: {
        cpp: {
          lines: [
            'string similarRGB(string color) {',
            '    int want[3];',
            '    for (int k = 0; k < 3; ++k) want[k] = stoi(color.substr(1 + 2 * k, 2), nullptr, 16);',
            '    long long best = LLONG_MIN; string out;',
            '    for (int r = 0; r < 16; ++r)',
            '        for (int g = 0; g < 16; ++g)',
            '            for (int b = 0; b < 16; ++b) {',
            '                int ch[3] = {r * 17, g * 17, b * 17};',
            '                long long score = 0;',
            '                for (int k = 0; k < 3; ++k) score -= (long long)(ch[k] - want[k]) * (ch[k] - want[k]);',
            '                if (score > best) {',
            '                    best = score;',
            '                    char buf[8];',
            '                    snprintf(buf, sizeof(buf), "#%x%x%x%x%x%x", r, r, g, g, b, b);',
            '                    out = buf;',
            '                }',
            '            }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function similarRGB(color) {',
            '  const want = [1, 3, 5].map((at) => parseInt(color.slice(at, at + 2), 16));',
            '  let best = -Infinity, out = "";',
            '  for (let r = 0; r < 16; r++)',
            '    for (let g = 0; g < 16; g++)',
            '      for (let b = 0; b < 16; b++) {',
            '        const ch = [r * 17, g * 17, b * 17];',
            '        let score = 0;',
            '        for (let k = 0; k < 3; k++) score -= (ch[k] - want[k]) ** 2;',
            '        if (score > best) {',
            '          best = score;',
            '          out = "#" + [r, g, b].map((d) => d.toString(16).repeat(2)).join("");',
            '        }',
            '      }',
            '  return out;',
            '}',
          ],
        },
      },
      run([color]: [string], c) {
        const want = [1, 3, 5].map((at) => parseInt(color.slice(at, at + 2), 16))
        let best = -Infinity
        let out = ''
        for (let r = 0; r < 16; r++)
          for (let g = 0; g < 16; g++)
            for (let b = 0; b < 16; b++) {
              c.ops++
              const ch = [r * 17, g * 17, b * 17]
              let score = 0
              for (let k = 0; k < 3; k++) score -= (ch[k] - want[k]) ** 2
              if (score > best) {
                best = score
                out = '#' + [r, g, b].map((d) => d.toString(16).repeat(2)).join('')
              }
            }
        return out
      },
    },
    {
      id: 'per-channel',
      label: 'Pick the best digit per channel',
      kind: 'better',
      time: 'O(3 * 16)',
      space: 'O(1)',
      blurb:
        'The score is a sum of one term per channel, and each term depends on that channel alone, so the best colour is simply the best choice in each channel made separately. That collapses 4096 candidates to sixteen per channel: try the digits 0 to f, keep the one whose doubled value lands closest, and glue the three winners together.',
      code: {
        cpp: {
          lines: [
            'string similarRGB(string color) {',
            '    string out = "#";',
            '    for (int k = 0; k < 3; ++k) {',
            '        int want = stoi(color.substr(1 + 2 * k, 2), nullptr, 16);',
            '        int bestDigit = 0;',
            '        for (int d = 0; d < 16; ++d)',
            '            if (abs(d * 17 - want) < abs(bestDigit * 17 - want)) bestDigit = d;',
            '        char buf[4];',
            '        snprintf(buf, sizeof(buf), "%x%x", bestDigit, bestDigit);',
            '        out += buf;',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function similarRGB(color) {',
            '  let out = "#";',
            '  for (let k = 0; k < 3; k++) {',
            '    const want = parseInt(color.slice(1 + 2 * k, 3 + 2 * k), 16);',
            '    let bestDigit = 0;',
            '    for (let d = 0; d < 16; d++)',
            '      if (Math.abs(d * 17 - want) < Math.abs(bestDigit * 17 - want)) bestDigit = d;',
            '    out += bestDigit.toString(16).repeat(2);',
            '  }',
            '  return out;',
            '}',
          ],
        },
      },
      run([color]: [string], c) {
        let out = '#'
        for (let k = 0; k < 3; k++) {
          const want = parseInt(color.slice(1 + 2 * k, 3 + 2 * k), 16)
          let bestDigit = 0
          for (let d = 0; d < 16; d++) {
            c.ops++
            if (Math.abs(d * 17 - want) < Math.abs(bestDigit * 17 - want)) bestDigit = d
          }
          out += bestDigit.toString(16).repeat(2)
        }
        return out
      },
    },
    {
      id: 'round',
      label: 'Round each channel to a multiple of 17',
      kind: 'optimal',
      time: 'O(1)',
      space: 'O(1)',
      blurb:
        'Trying sixteen digits per channel is still a search for something with a closed form. A shorthand channel "dd" equals 17 times the digit, so the candidates are 0, 17, 34 … 255 and the closest one is the value divided by 17 and rounded — three divisions and no loop at all.',
      code: {
        cpp: {
          lines: [
            'string similarRGB(string color) {',
            '    auto near = [](const string& h) {',
            '        int v = stoi(h, nullptr, 16);',
            '        int q = (int)llround(v / 17.0) * 17;',
            '        char buf[3];',
            '        snprintf(buf, sizeof(buf), "%02x", q);',
            '        return string(buf);',
            '    };',
            '    return "#" + near(color.substr(1, 2))',
            '               + near(color.substr(3, 2))',
            '               + near(color.substr(5, 2));',
            '}',
          ],
        },
        js: {
          lines: [
            'function similarRGB(color) {',
            '  const near = (h) => {',
            '    const v = parseInt(h, 16);',
            '    const q = Math.round(v / 17) * 17;',
            '    return q.toString(16).padStart(2, "0");',
            '  };',
            '  return "#" + near(color.slice(1, 3))',
            '             + near(color.slice(3, 5))',
            '             + near(color.slice(5, 7));',
            '}',
          ],
        },
      },

      run([color]: [string], c) {
        const near = (h: string) => {
          c.ops++
          const v = parseInt(h, 16)
          const q = Math.round(v / 17) * 17
          return q.toString(16).padStart(2, '0')
        }
        return '#' + near(color.slice(1, 3)) + near(color.slice(3, 5)) + near(color.slice(5, 7))
      },
    },
  ],
}
