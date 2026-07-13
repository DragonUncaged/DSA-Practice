import type { Problem } from '@/lib/types'

export const serializeAndDeserializeNaryTree: Problem = {
  id: 'serialize-and-deserialize-n-ary-tree',
  title: 'Serialize and Deserialize N-ary Tree',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/serialize-and-deserialize-n-ary-tree/',
  statement:
    'Write `serialize` and `deserialize` for an N-ary tree, where a node holds a value and a list of children. Any format works as long as the round trip rebuilds the tree exactly. The trick is recording where a child list ends: either write each node as value plus child count, or emit a marker after the last child.',
  constraints: [
    'The number of nodes is in the range [0, 10^4]',
    '0 <= Node.val <= 10^4',
    'The height is at most 1000',
    'The algorithms must be stateless — no member, global or static variables',
  ],
}
