import type { Problem } from '@/lib/types'

export const readNCharactersGivenRead4: Problem = {
  id: 'read-n-characters-given-read4',
  title: 'Read N Characters Given Read4',
  group: 'Easy',
  pattern: 'Design',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/read-n-characters-given-read4/',
  statement:
    'You may only touch a file through `read4(buf4)`, which copies up to four characters into `buf4` and returns how many it actually read. Implement `read(buf, n)`, which fills `buf` with up to `n` characters from the file and returns the number read. `read` is called only once per file, so a short `read4` means end of file and you can stop.',
  constraints: [
    '1 <= file.length <= 500',
    'file consists of English letters and digits',
    '1 <= n <= 1000',
    'read is called exactly once',
  ],
}
