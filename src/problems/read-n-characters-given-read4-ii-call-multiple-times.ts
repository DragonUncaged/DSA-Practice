import type { Problem } from '@/lib/types'

export const readNCharactersGivenRead4II: Problem = {
  id: 'read-n-characters-given-read4-ii-call-multiple-times',
  title: 'Read N Characters Given read4 II - Call Multiple Times',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode:
    'https://leetcode.com/problems/read-n-characters-given-read4-ii-call-multiple-times/',
  statement:
    'Same `read4(buf4)` API as the first version, but now `read(buf, n)` may be called many times on the same file. `read4` always hands back four characters, so a call that asks for fewer leaves a remainder that the next call must consume first — the object has to carry a small four-character buffer and an offset into it across calls.',
  constraints: [
    '1 <= file.length <= 500',
    'file consists of English letters and digits',
    '1 <= queries.length <= 10',
    '1 <= queries[i] <= 500',
  ],
}
