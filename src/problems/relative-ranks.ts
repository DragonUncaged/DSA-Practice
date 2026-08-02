import type { Problem } from '@/lib/types'

export const relativeRanks: Problem = {
  id: 'relative-ranks',
  title: 'Relative Ranks',
  group: 'Array',
  pattern: 'Sort by Index',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/relative-ranks/',
  statement:
    'Given the distinct scores of a race, return each athlete\'s placement in the original order. The top three receive `"Gold Medal"`, `"Silver Medal"` and `"Bronze Medal"`; everyone else receives their placement as a string.',
  constraints: ['1 <= score.length <= 10^4', 'All scores are distinct', '0 <= score[i] <= 10^6'],
  signature: {
    fn: 'findRelativeRanks',
    params: [{ name: 'score', type: 'int[]' }],
    ret: 'string[]',
  },
  tests: [
    {
      args: [[5, 4, 3, 2, 1]],
      expect: ['Gold Medal', 'Silver Medal', 'Bronze Medal', '4', '5'],
    },
    {
      args: [[10, 3, 8, 9, 4]],
      expect: ['Gold Medal', '5', 'Bronze Medal', 'Silver Medal', '4'],
    },
    { args: [[1]], expect: ['Gold Medal'] },
    { args: [[2, 1]], expect: ['Gold Medal', 'Silver Medal'], note: 'fewer than three athletes' },
    { args: [[1, 2, 3]], expect: ['Bronze Medal', 'Silver Medal', 'Gold Medal'], note: 'ascending scores' },
    { args: [[1000000, 0]], expect: ['Gold Medal', 'Silver Medal'], note: 'the score bounds' },
    {
      args: [Array.from({ length: 3000 }, (_, i) => i)],
      expect: Array.from({ length: 3000 }, (_, i) =>
        i === 2999 ? 'Gold Medal' : i === 2998 ? 'Silver Medal' : i === 2997 ? 'Bronze Medal' : String(3000 - i),
      ),
      note: 'a long field in ascending order',
    },
  ],
  demo: [[10, 3, 8, 9, 4]],
  scale: (n) => [Array.from({ length: n }, (_, i) => i)],
  starter: {
    js: `function findRelativeRanks(score) {
  // score: number[]  ->  string[]
}
`,
    cpp: `vector<string> findRelativeRanks(vector<int>& score) {
    // your code here
}
`,
  },

  solutions: [
    {
      id: 'count-better',
      label: 'Count how many scores beat each athlete',
      kind: 'brute',
      time: 'O(n^2)',
      space: 'O(1)',
      blurb:
        'An athlete\'s placement is one more than the number of scores above theirs, so count that for each athlete with a scan over everyone else. Nothing needs sorting and the output lands in the original order by construction, but every athlete pays a full pass over the field.',
      code: {
        cpp: {
          lines: [
            'vector<string> findRelativeRanks(vector<int>& score) {',
            '    int n = score.size();',
            '    vector<string> out(n);',
            '    const char* medal[3] = {"Gold Medal", "Silver Medal", "Bronze Medal"};',
            '    for (int i = 0; i < n; ++i) {',
            '        int place = 0;',
            '        for (int j = 0; j < n; ++j) if (score[j] > score[i]) ++place;',
            '        out[i] = place < 3 ? medal[place] : to_string(place + 1);',
            '    }',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findRelativeRanks(score) {',
            '  const medal = ["Gold Medal", "Silver Medal", "Bronze Medal"];',
            '  return score.map((s) => {',
            '    let place = 0;',
            '    for (const other of score) if (other > s) place++;',
            '    return place < 3 ? medal[place] : String(place + 1);',
            '  });',
            '}',
          ],
        },
      },
      run([score]: [number[]], c) {
        const medal = ['Gold Medal', 'Silver Medal', 'Bronze Medal']
        return score.map((s) => {
          let place = 0
          for (const other of score) {
            c.ops++
            if (other > s) place++
          }
          return place < 3 ? medal[place] : String(place + 1)
        })
      },
    },
    {
      id: 'sort-indices',
      label: 'Sort the indices, not the scores',
      kind: 'optimal',
      time: 'O(n log n)',
      space: 'O(n)',
      blurb:
        'One sort settles every placement at once. The answer must come back in the original order, so sorting the scores themselves loses exactly the information needed; sort the indices by their score instead. Walking that sorted list gives placements in order, and each entry still names the slot to write into.',
      code: {
        cpp: {
          lines: [
            'vector<string> findRelativeRanks(vector<int>& score) {',
            '    int n = score.size();',
            '    vector<int> idx(n);',
            '    iota(idx.begin(), idx.end(), 0);',
            '    sort(idx.begin(), idx.end(), [&](int a, int b) { return score[a] > score[b]; });',
            '    vector<string> out(n);',
            '    const char* medal[3] = {"Gold Medal", "Silver Medal", "Bronze Medal"};',
            '    for (int place = 0; place < n; ++place)',
            '        out[idx[place]] = place < 3 ? medal[place] : to_string(place + 1);',
            '    return out;',
            '}',
          ],
        },
        js: {
          lines: [
            'function findRelativeRanks(score) {',
            '  const idx = score.map((_, i) => i);',
            '  idx.sort((a, b) => score[b] - score[a]);',
            '  const medal = ["Gold Medal", "Silver Medal", "Bronze Medal"];',
            '  const out = new Array(score.length);',
            '  idx.forEach((at, place) => {',
            '    out[at] = place < 3 ? medal[place] : String(place + 1);',
            '  });',
            '  return out;',
            '}',
          ],
        },
      },

      run([score]: [number[]], c) {
        const idx = score.map((_, i) => i)
        idx.sort((a, b) => {
          c.ops++
          return score[b] - score[a]
        })
        const medal = ['Gold Medal', 'Silver Medal', 'Bronze Medal']
        const out = new Array<string>(score.length)
        idx.forEach((at, place) => {
          c.ops++
          out[at] = place < 3 ? medal[place] : String(place + 1)
        })
        return out
      },
    },
  ],
}
