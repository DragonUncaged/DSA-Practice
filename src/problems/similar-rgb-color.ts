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
      id: 'round',
      label: 'Round each channel to a multiple of 17',
      kind: 'optimal',
      time: 'O(1)',
      space: 'O(1)',
      blurb:
        'The three channels are independent, so the best colour is the best choice in each one separately. A shorthand channel "dd" equals 17 times the digit, so the candidates per channel are 0, 17, 34 … 255 — and the closest one is simply the value divided by 17 and rounded.',
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
