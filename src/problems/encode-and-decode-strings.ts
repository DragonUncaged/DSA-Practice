import { arr, combo, text, type Problem, type Tone } from '@/lib/types'

const DEMO: [string[]] = [['hi', 'a#b', '', 'code']]

export const encodeAndDecodeStrings: Problem = {
  id: 'encode-and-decode-strings',
  title: 'Encode and Decode Strings',
  group: 'String',
  pattern: 'Length Prefixing',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/encode-and-decode-strings/',
  statement:
    'Design `encode`, which packs a list of strings into one string, and `decode`, which unpacks it exactly — for any input, including delimiters and empty strings. The runner here calls your single function `encodeDecode(strs)`, which must return `decode(encode(strs))` using your own two helpers.',
  constraints: ['0 <= strs.length <= 200', 'Any characters may appear, including your delimiter'],
  signature: { fn: 'encodeDecode', params: [{ name: 'strs', type: 'string[]' }], ret: 'string[]' },
  tests: [
    { args: [['hello', 'world']], expect: ['hello', 'world'] },
    { args: [['a#b', 'c']], expect: ['a#b', 'c'], note: 'the delimiter appears in the data' },
    { args: [['']], expect: [''], note: 'a single empty string must survive' },
    { args: [[]], expect: [] },
    { args: [['12#ab', '3#', '#']], expect: ['12#ab', '3#', '#'] },
  ],
  demo: DEMO,
  scale: (n) => [Array.from({ length: n }, (_, i) => 'str' + i)],
  starter: {
    js: `function encodeDecode(strs) {
  // implement encode(strs) -> string and decode(s) -> string[],
  // then return decode(encode(strs))
}
`,
    cpp: `vector<string> encodeDecode(vector<string>& strs) {
    // implement encode/decode, return decode(encode(strs))
}
`,
  },

  solutions: [
    {
      id: 'length-prefix',
      label: 'Length, then #, then the bytes',
      kind: 'optimal',
      time: 'O(total length)',
      space: 'O(total length)',
      blurb:
        'Escaping delimiters is fragile — instead, announce each string\'s length up front: "5#hello". The decoder reads the number, skips the #, then consumes exactly that many characters without ever inspecting them, so no character in the payload can confuse it.',
      code: {
        cpp: {
          lines: [
            'vector<string> encodeDecode(vector<string>& strs) {',
            '    string blob;',
            '    for (auto& x : strs) blob += to_string(x.size()) + "#" + x;',
            '    vector<string> out;',
            '    size_t i = 0;',
            '    while (i < blob.size()) {',
            "        size_t j = blob.find('#', i);",
            '        int len = stoi(blob.substr(i, j - i));',
            '        out.push_back(blob.substr(j + 1, len));',
            '        i = j + 1 + len;',
            '    }',
            '    return out;',
            '}',
          ],
          map: { pack: 3, read: 8, slice: 9, done: 12 },
        },
        js: {
          lines: [
            'function encodeDecode(strs) {',
            "  const encode = (xs) => xs.map((x) => `${x.length}#${x}`).join('');",
            '  const decode = (s) => {',
            '    const out = [];',
            '    let i = 0;',
            '    while (i < s.length) {',
            "      const j = s.indexOf('#', i);",
            '      const len = Number(s.slice(i, j));',
            '      out.push(s.slice(j + 1, j + 1 + len));',
            '      i = j + 1 + len;',
            '    }',
            '    return out;',
            '  };',
            '  return decode(encode(strs));',
            '}',
          ],
          map: { pack: 2, read: 8, slice: 9, done: 14 },
        },
      },

      trace(t, [strs]: [string[]]) {
        const blob = strs.map((x) => `${x.length}#${x}`).join('')

        const blobView = (from: number, to: number, tone: Tone) => {
          const tones: Record<number, Tone> = {}
          blob.split('').forEach((_, i) => {
            tones[i] = i >= from && i <= to ? tone : i < from ? 'done' : 'idle'
          })
          return text(blob.length ? blob : '∅', {
            tones: blob.length ? tones : {},
            title: 'the encoded blob',
            showIndex: false,
          })
        }

        t.push({
          step: 'pack',
          note: strs.length
            ? `Encode: each string becomes "length#payload" — ${strs.map((x) => `"${x.length}#${x}"`).join(' + ')} → "${blob}". The lengths are self-describing; no escaping anywhere.`
            : 'Encoding an empty list produces an empty blob.',
          view: combo(
            arr(strs.length ? strs.map((x) => (x === '' ? '∅' : x)) : ['—'], { title: 'input strings' }),
            blobView(-1, -1, 'idle'),
          ),
          vars: [['blob', `"${blob}"`, 'c']],
          badge: { text: 'encoded', accent: 'c' },
        })

        const out: string[] = []
        let i = 0
        while (i < blob.length && !t.full) {
          const j = blob.indexOf('#', i)
          const len = Number(blob.slice(i, j))
          t.bump()
          t.push({
            step: 'read',
            note: `Decoder at position ${i}: read digits up to the # — the next payload is ${len} character${len === 1 ? '' : 's'} long.`,
            view: blobView(i, j, 'active'),
            vars: [
              ['header', `"${blob.slice(i, j)}#"`, 'b'],
              ['length', len, 'c'],
            ],
            badge: { text: `next: ${len} chars`, accent: 'b' },
          })

          const piece = blob.slice(j + 1, j + 1 + len)
          out.push(piece)
          t.push({
            step: 'slice',
            note: `Consume exactly ${len} character${len === 1 ? '' : 's'} blind — "${piece}" — without ever looking for a delimiter inside them. Even a # in the payload cannot mislead the decoder.`,
            view: blobView(j + 1, j + len, 'good'),
            vars: [
              ['recovered', piece === '' ? '(empty)' : `"${piece}"`, 'ok'],
              ['strings so far', out.length],
            ],
            badge: { text: `"${piece}"`, accent: 'ok' },
          })
          i = j + 1 + len
        }

        t.push({
          step: 'done',
          note: `Round trip complete: ${out.length} string${out.length === 1 ? '' : 's'} recovered, byte-for-byte identical to the input.`,
          view: combo(
            arr(out.length ? out.map((x) => (x === '' ? '∅' : x)) : ['—'], { title: 'decoded strings' }),
            blobView(-1, -1, 'idle'),
          ),
          vars: [['answer', JSON.stringify(out), 'ok']],
          badge: { text: 'lossless', accent: 'ok' },
        })
      },

      run([strs]: [string[]], c) {
        let blob = ''
        for (const x of strs) {
          c.ops++
          blob += `${x.length}#${x}`
        }
        const out: string[] = []
        let i = 0
        while (i < blob.length) {
          c.ops++
          const j = blob.indexOf('#', i)
          const len = Number(blob.slice(i, j))
          out.push(blob.slice(j + 1, j + 1 + len))
          i = j + 1 + len
        }
        return out
      },
    },
  ],
}
