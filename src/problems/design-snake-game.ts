import type { Problem } from '@/lib/types'

export const designSnakeGame: Problem = {
  id: 'design-snake-game',
  title: 'Design Snake Game',
  group: 'Medium',
  pattern: 'Design',
  difficulty: 'Medium',
  leetcode: 'https://leetcode.com/problems/design-snake-game/',
  statement:
    'Design a `SnakeGame` on a `width x height` screen. The snake starts at `(0, 0)` with length 1, and `move(direction)` returns the score afterwards, or `-1` when the snake leaves the screen or runs into itself. Food appears one piece at a time in the order given as `[row, col]`, each bite growing the snake by one. A deque holds the body and a set of occupied cells makes the self-collision check `O(1)` — remembering to free the tail cell before testing the new head. Once the game is over, every later move returns `-1`.',
  constraints: [
    '1 <= width, height <= 10^4',
    '1 <= food.length <= 50',
    "direction is 'U', 'D', 'L', or 'R'",
    'At most 10^4 calls are made to move',
  ],

  design: {
    className: 'SnakeGame',
    ctor: [
      { name: 'width', type: 'int' },
      { name: 'height', type: 'int' },
      { name: 'food', type: 'int[][]' },
    ],
    methods: [{ name: 'move', params: [{ name: 'direction', type: 'string' }], ret: 'int' }],
  },

  designTests: [
    {
      ops: ['SnakeGame', 'move', 'move', 'move', 'move', 'move', 'move'],
      args: [[3, 2, [[1, 2], [0, 1]]], ['R'], ['D'], ['R'], ['U'], ['L'], ['U']],
      expect: [null, 0, 0, 1, 1, 2, -1],
    },
    // the snake may move into the cell its own tail is leaving
    {
      ops: ['SnakeGame', 'move', 'move', 'move', 'move', 'move', 'move', 'move'],
      args: [[2, 2, [[0, 1], [1, 1], [1, 0]]], ['R'], ['D'], ['L'], ['U'], ['R'], ['D'], ['L']],
      expect: [null, 1, 2, 3, 3, 3, 3, 3],
    },
    // running into the body ends the game, and every later move stays -1
    {
      ops: ['SnakeGame', 'move', 'move', 'move', 'move', 'move', 'move', 'move'],
      args: [[3, 3, [[0, 1], [0, 2], [1, 2], [2, 2]]], ['R'], ['R'], ['D'], ['D'], ['L'], ['U'], ['R']],
      expect: [null, 1, 2, 3, 4, 4, 4, -1],
    },
    // a single cell: the very first move is off the screen
    { ops: ['SnakeGame', 'move'], args: [[1, 1, [[0, 0]]], ['D']], expect: [null, -1] },
    // eating the last food, then wandering on with nothing left to eat
    {
      ops: ['SnakeGame', 'move', 'move', 'move'],
      args: [[3, 1, [[0, 1]]], ['R'], ['R'], ['R']],
      expect: [null, 1, 1, -1],
    },
  ],

  starter: {
    js: `class SnakeGame {
  constructor(width, height, food) {
    // width: number, height: number, food: number[][] of [row, col]
  }

  move(direction) {
    // direction: 'U' | 'D' | 'L' | 'R'  ->  the score, or -1 once the game is over
  }
}
`,
    cpp: `class SnakeGame {
public:
    SnakeGame(int width, int height, const vector<vector<int>>& food) {
    }

    int move(string direction) {
        // your code here
    }
};
`,
  },

  solutions: [
    {
      id: 'body-array-scan',
      label: 'Keep the body in an array and scan it for collisions',
      kind: 'brute',
      time: 'O(length) per move',
      space: 'O(length)',
      blurb:
        'Hold the body as a list of cells, head last. Each move computes the new head, drops the tail unless food is eaten, and then walks the whole body to see whether the head landed on it. Correct, but the collision check grows with the snake — the longer the game, the slower each move.',
      code: {
        cpp: {
          lines: [
            'class SnakeGame {',
            '    int width, height, eaten = 0;',
            '    vector<vector<int>> food;',
            '    vector<pair<int, int>> body;  // tail first, head last',
            '    bool over = false;',
            '',
            'public:',
            '    SnakeGame(int width, int height, const vector<vector<int>>& food)',
            '        : width(width), height(height), food(food), body{{0, 0}} {}',
            '',
            '    int move(string direction) {',
            '        if (over) return -1;',
            '        auto [r, c] = body.back();',
            "        if (direction == \"U\") --r; else if (direction == \"D\") ++r;",
            "        else if (direction == \"L\") --c; else ++c;",
            '        if (r < 0 || c < 0 || r >= height || c >= width) { over = true; return -1; }',
            '        bool eat = eaten < (int)food.size() && food[eaten][0] == r && food[eaten][1] == c;',
            '        if (eat) ++eaten;',
            '        else body.erase(body.begin());',
            '        for (auto& cell : body)',
            '            if (cell.first == r && cell.second == c) { over = true; return -1; }',
            '        body.push_back({r, c});',
            '        return eaten;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class SnakeGame {',
            '  constructor(width, height, food) {',
            '    this.width = width;',
            '    this.height = height;',
            '    this.food = food;',
            '    this.eaten = 0;',
            '    this.body = [[0, 0]]; // tail first, head last',
            '    this.over = false;',
            '  }',
            '',
            '  move(direction) {',
            '    if (this.over) return -1;',
            '    let [r, c] = this.body[this.body.length - 1];',
            "    if (direction === 'U') r--;",
            "    else if (direction === 'D') r++;",
            "    else if (direction === 'L') c--;",
            '    else c++;',
            '    if (r < 0 || c < 0 || r >= this.height || c >= this.width) { this.over = true; return -1; }',
            '',
            '    const next = this.food[this.eaten];',
            '    if (next && next[0] === r && next[1] === c) this.eaten++;',
            '    else this.body.shift();',
            '    if (this.body.some(([br, bc]) => br === r && bc === c)) { this.over = true; return -1; }',
            '    this.body.push([r, c]);',
            '    return this.eaten;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (number | string | number[][])[][]], c) {
        const [width, height, food] = args[0] as [number, number, number[][]]
        let eaten = 0
        let body: [number, number][] = [[0, 0]]
        let over = false
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'move') {
            out.push(null)
            continue
          }
          if (over) {
            out.push(-1)
            continue
          }
          const direction = args[i][0] as string
          let [r, col] = body[body.length - 1]
          if (direction === 'U') r--
          else if (direction === 'D') r++
          else if (direction === 'L') col--
          else col++
          if (r < 0 || col < 0 || r >= height || col >= width) {
            over = true
            out.push(-1)
            continue
          }
          const next = food[eaten]
          if (next && next[0] === r && next[1] === col) eaten++
          else body = body.slice(1)
          let hit = false
          for (const [br, bc] of body) {
            c.ops++
            if (br === r && bc === col) hit = true
          }
          if (hit) {
            over = true
            out.push(-1)
            continue
          }
          body.push([r, col])
          out.push(eaten)
        }
        return out
      },
    },
    // -----------------------------------------------------------------------
    {
      id: 'deque-and-set',
      label: 'A deque for the body and a set of occupied cells',
      kind: 'optimal',
      time: 'O(1) per move',
      space: 'O(length)',
      blurb:
        'The body only ever changes at its two ends, which is what a deque is for, and "is this cell occupied?" is a set lookup rather than a scan. Free the tail cell before testing the new head — the snake is allowed to move into the cell its tail is leaving — and only then check for a collision.',
      code: {
        cpp: {
          lines: [
            'class SnakeGame {',
            '    int width, height, eaten = 0;',
            '    vector<vector<int>> food;',
            '    deque<pair<int, int>> body;  // tail at the front, head at the back',
            '    unordered_set<long long> occupied;',
            '    bool over = false;',
            '    long long key(int r, int c) { return (long long)r * width + c; }',
            '',
            'public:',
            '    SnakeGame(int width, int height, const vector<vector<int>>& food)',
            '        : width(width), height(height), food(food) {',
            '        body.push_back({0, 0});',
            '        occupied.insert(key(0, 0));',
            '    }',
            '',
            '    int move(string direction) {',
            '        if (over) return -1;',
            '        auto [r, c] = body.back();',
            "        if (direction == \"U\") --r; else if (direction == \"D\") ++r;",
            "        else if (direction == \"L\") --c; else ++c;",
            '        if (r < 0 || c < 0 || r >= height || c >= width) { over = true; return -1; }',
            '        bool eat = eaten < (int)food.size() && food[eaten][0] == r && food[eaten][1] == c;',
            '        if (eat) ++eaten;',
            '        else { occupied.erase(key(body.front().first, body.front().second)); body.pop_front(); }',
            '        if (occupied.count(key(r, c))) { over = true; return -1; }',
            '        body.push_back({r, c});',
            '        occupied.insert(key(r, c));',
            '        return eaten;',
            '    }',
            '};',
          ],
        },
        js: {
          lines: [
            'class SnakeGame {',
            '  constructor(width, height, food) {',
            '    this.width = width;',
            '    this.height = height;',
            '    this.food = food;',
            '    this.eaten = 0;',
            '    this.body = [[0, 0]]; // tail at body[head], head at the end',
            '    this.head = 0;',
            '    this.occupied = new Set([0]);',
            '    this.over = false;',
            '  }',
            '',
            '  key(r, c) {',
            '    return r * this.width + c;',
            '  }',
            '',
            '  move(direction) {',
            '    if (this.over) return -1;',
            '    let [r, c] = this.body[this.body.length - 1];',
            "    if (direction === 'U') r--;",
            "    else if (direction === 'D') r++;",
            "    else if (direction === 'L') c--;",
            '    else c++;',
            '    if (r < 0 || c < 0 || r >= this.height || c >= this.width) { this.over = true; return -1; }',
            '',
            '    const next = this.food[this.eaten];',
            '    if (next && next[0] === r && next[1] === c) {',
            '      this.eaten++;',
            '    } else {',
            '      const [tr, tc] = this.body[this.head++];',
            '      this.occupied.delete(this.key(tr, tc));',
            '    }',
            '    if (this.occupied.has(this.key(r, c))) { this.over = true; return -1; }',
            '    this.body.push([r, c]);',
            '    this.occupied.add(this.key(r, c));',
            '    return this.eaten;',
            '  }',
            '}',
          ],
        },
      },

      run([ops, args]: [string[], (number | string | number[][])[][]], c) {
        const [width, height, food] = args[0] as [number, number, number[][]]
        let eaten = 0
        const body: [number, number][] = [[0, 0]]
        let head = 0
        const occupied = new Set<number>([0])
        let over = false
        const key = (r: number, col: number) => r * width + col
        const out: (number | null)[] = [null]
        for (let i = 1; i < ops.length; i++) {
          if (ops[i] !== 'move') {
            out.push(null)
            continue
          }
          c.ops++
          if (over) {
            out.push(-1)
            continue
          }
          const direction = args[i][0] as string
          let [r, col] = body[body.length - 1]
          if (direction === 'U') r--
          else if (direction === 'D') r++
          else if (direction === 'L') col--
          else col++
          if (r < 0 || col < 0 || r >= height || col >= width) {
            over = true
            out.push(-1)
            continue
          }
          const next = food[eaten]
          if (next && next[0] === r && next[1] === col) eaten++
          else {
            const [tr, tc] = body[head++]
            occupied.delete(key(tr, tc))
          }
          if (occupied.has(key(r, col))) {
            over = true
            out.push(-1)
            continue
          }
          body.push([r, col])
          occupied.add(key(r, col))
          out.push(eaten)
        }
        return out
      },
    },
  ],
}
