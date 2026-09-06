import type { Problem } from '@/lib/types'

/**
 * The runner cannot hide a grid behind a callback API, so the starter provides
 * the `Robot` class over a copy of the room and a `cleanedRoom` wrapper that
 * builds it, runs the learner's `cleanRoom(robot)`, and returns the room with
 * every cleaned cell marked 2. The algorithm itself only ever touches the four
 * robot calls.
 */
export const robotRoomCleaner: Problem = {
  id: 'robot-room-cleaner',
  title: 'Robot Room Cleaner',
  group: 'Hard',
  pattern: 'Design',
  difficulty: 'Hard',
  leetcode: 'https://leetcode.com/problems/robot-room-cleaner/',
  statement:
    'A robot sits somewhere in an unknown room and you may only call `move()`, `turnLeft()`, `turnRight()` and `clean()` — the grid itself is hidden. Clean every reachable cell. The way in is to keep your own coordinates relative to the start, spiral through the four headings at each cell, and after each branch back up by turning around, moving once, and turning around again so the robot is exactly where it started. The tests build the provided `Robot` over the room, facing up at `(row, col)`, run your `cleanRoom(robot)`, and expect every open cell (`1`) to have become cleaned (`2`).',
  constraints: [
    '1 <= m <= 100 and 1 <= n <= 200',
    'room[i][j] is 0 (wall) or 1 (open)',
    'The robot starts on an open cell facing up',
    'Every open cell is reachable from the start',
  ],
  signature: {
    fn: 'cleanedRoom',
    params: [
      { name: 'room', type: 'int[][]' },
      { name: 'row', type: 'int' },
      { name: 'col', type: 'int' },
    ],
    ret: 'int[][]',
  },
  tests: [
    {
      args: [
        [
          [1, 1, 1, 1, 1, 0, 1, 1],
          [1, 1, 1, 1, 1, 0, 1, 1],
          [1, 0, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 1, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
        ],
        1,
        3,
      ],
      expect: [
        [2, 2, 2, 2, 2, 0, 2, 2],
        [2, 2, 2, 2, 2, 0, 2, 2],
        [2, 0, 2, 2, 2, 2, 2, 2],
        [0, 0, 0, 2, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2],
      ],
    },
    { args: [[[1]], 0, 0], expect: [[2]], note: 'a single cell' },
    { args: [[[1, 1, 1, 1]], 0, 3], expect: [[2, 2, 2, 2]], note: 'a corridor, starting at the far end' },
    {
      args: [[[1, 0, 1], [1, 1, 1], [1, 0, 1]], 0, 0],
      expect: [[2, 0, 2], [2, 2, 2], [2, 0, 2]],
      note: 'an H shape: the robot must back out of dead ends',
    },
    {
      args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]], 1, 0],
      expect: [[2, 2, 2], [2, 0, 2], [2, 2, 2]],
      note: 'a ring around a wall',
    },
    {
      args: [[[0, 1, 0], [1, 1, 1], [0, 1, 0]], 1, 1],
      expect: [[0, 2, 0], [2, 2, 2], [0, 2, 0]],
      note: 'a plus sign, starting in the middle',
    },
  ],
  demo: [
    [
      [1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ],
    1,
    3,
  ],
  starter: {
    js: `// Provided: the hidden room. The robot starts facing up; cleaning marks a cell 2.
class Robot {
  constructor(room, row, col) {
    this.room = room;
    this.r = row;
    this.c = col;
    this.dir = 0; // 0 up, 1 right, 2 down, 3 left
  }
  move() {
    const [dr, dc] = [[-1, 0], [0, 1], [1, 0], [0, -1]][this.dir];
    const nr = this.r + dr;
    const nc = this.c + dc;
    if (nr < 0 || nc < 0 || nr >= this.room.length || nc >= this.room[0].length) return false;
    if (this.room[nr][nc] === 0) return false;
    this.r = nr;
    this.c = nc;
    return true;
  }
  turnLeft() { this.dir = (this.dir + 3) % 4; }
  turnRight() { this.dir = (this.dir + 1) % 4; }
  clean() { this.room[this.r][this.c] = 2; }
}

function cleanRoom(robot) {
  // use only robot.move(), robot.turnLeft(), robot.turnRight() and robot.clean()
}

// Provided: builds the robot, runs cleanRoom, and returns the room with cleaned cells marked 2. Do not edit.
function cleanedRoom(room, row, col) {
  const copy = room.map((r) => r.slice());
  cleanRoom(new Robot(copy, row, col));
  return copy;
}
`,
    cpp: `// Provided: the hidden room. The robot starts facing up; cleaning marks a cell 2.
class Robot {
    vector<vector<int>>& room;
    int r, c, dir = 0;  // 0 up, 1 right, 2 down, 3 left
public:
    Robot(vector<vector<int>>& room, int row, int col) : room(room), r(row), c(col) {}
    bool move() {
        const int dr[4] = {-1, 0, 1, 0}, dc[4] = {0, 1, 0, -1};
        int nr = r + dr[dir], nc = c + dc[dir];
        if (nr < 0 || nc < 0 || nr >= (int)room.size() || nc >= (int)room[0].size()) return false;
        if (room[nr][nc] == 0) return false;
        r = nr; c = nc;
        return true;
    }
    void turnLeft() { dir = (dir + 3) % 4; }
    void turnRight() { dir = (dir + 1) % 4; }
    void clean() { room[r][c] = 2; }
};

void cleanRoom(Robot& robot) {
    // use only robot.move(), robot.turnLeft(), robot.turnRight() and robot.clean()
}

// Provided: builds the robot, runs cleanRoom, and returns the room with cleaned cells marked 2. Do not edit.
vector<vector<int>> cleanedRoom(vector<vector<int>>& room, int row, int col) {
    vector<vector<int>> copy = room;
    Robot robot(copy, row, col);
    cleanRoom(robot);
    return copy;
}
`,
  },

  solutions: [
    {
      id: 'backtracking-dfs',
      label: 'Depth-first search with backtracking through the robot',
      kind: 'optimal',
      time: 'O(m * n)',
      space: 'O(m * n)',
      blurb:
        'The robot is a depth-first search that has to carry its own map: track the current cell and heading relative to the start, and keep a set of cells already cleaned. At each cell, clean it, then try the four headings in turn — clockwise, so one right turn moves to the next — recursing whenever `move()` succeeds into an unvisited cell. Coming back from a branch means turning around, stepping once, and turning around again, which leaves the robot exactly as it was. Every open cell is entered once, so this is as little as any strategy can do.',
      code: {
        cpp: {
          lines: [
            '// Provided scaffold, unchanged from the starter',
            'class Robot {',
            '    vector<vector<int>>& room;',
            '    int r, c, dir = 0;',
            'public:',
            '    Robot(vector<vector<int>>& room, int row, int col) : room(room), r(row), c(col) {}',
            '    bool move() {',
            '        const int dr[4] = {-1, 0, 1, 0}, dc[4] = {0, 1, 0, -1};',
            '        int nr = r + dr[dir], nc = c + dc[dir];',
            '        if (nr < 0 || nc < 0 || nr >= (int)room.size() || nc >= (int)room[0].size()) return false;',
            '        if (room[nr][nc] == 0) return false;',
            '        r = nr; c = nc;',
            '        return true;',
            '    }',
            '    void turnLeft() { dir = (dir + 3) % 4; }',
            '    void turnRight() { dir = (dir + 1) % 4; }',
            '    void clean() { room[r][c] = 2; }',
            '};',
            '',
            'void cleanRoom(Robot& robot) {',
            '    const int dr[4] = {-1, 0, 1, 0}, dc[4] = {0, 1, 0, -1};  // up, right, down, left',
            '    set<pair<int, int>> seen;',
            '    auto goBack = [&]() {',
            '        robot.turnRight(); robot.turnRight();',
            '        robot.move();',
            '        robot.turnRight(); robot.turnRight();',
            '    };',
            '    function<void(int, int, int)> dfs = [&](int r, int c, int d) {',
            '        seen.insert({r, c});',
            '        robot.clean();',
            '        for (int k = 0; k < 4; ++k) {',
            '            int nd = (d + k) % 4;',
            '            int nr = r + dr[nd], nc = c + dc[nd];',
            '            if (!seen.count({nr, nc}) && robot.move()) {',
            '                dfs(nr, nc, nd);',
            '                goBack();',
            '            }',
            '            robot.turnRight();',
            '        }',
            '    };',
            '    dfs(0, 0, 0);',
            '}',
            '',
            'vector<vector<int>> cleanedRoom(vector<vector<int>>& room, int row, int col) {',
            '    vector<vector<int>> copy = room;',
            '    Robot robot(copy, row, col);',
            '    cleanRoom(robot);',
            '    return copy;',
            '}',
          ],
        },
        js: {
          lines: [
            '// Provided scaffold, unchanged from the starter',
            'class Robot {',
            '  constructor(room, row, col) { this.room = room; this.r = row; this.c = col; this.dir = 0; }',
            '  move() {',
            '    const [dr, dc] = [[-1, 0], [0, 1], [1, 0], [0, -1]][this.dir];',
            '    const nr = this.r + dr;',
            '    const nc = this.c + dc;',
            '    if (nr < 0 || nc < 0 || nr >= this.room.length || nc >= this.room[0].length) return false;',
            '    if (this.room[nr][nc] === 0) return false;',
            '    this.r = nr;',
            '    this.c = nc;',
            '    return true;',
            '  }',
            '  turnLeft() { this.dir = (this.dir + 3) % 4; }',
            '  turnRight() { this.dir = (this.dir + 1) % 4; }',
            '  clean() { this.room[this.r][this.c] = 2; }',
            '}',
            '',
            'function cleanRoom(robot) {',
            '  const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // up, right, down, left',
            '  const seen = new Set();',
            '  const goBack = () => {',
            '    robot.turnRight(); robot.turnRight();',
            '    robot.move();',
            '    robot.turnRight(); robot.turnRight();',
            '  };',
            '  const dfs = (r, c, d) => {',
            "    seen.add(r + ',' + c);",
            '    robot.clean();',
            '    for (let k = 0; k < 4; k++) {',
            '      const nd = (d + k) % 4;',
            '      const nr = r + dirs[nd][0];',
            '      const nc = c + dirs[nd][1];',
            "      if (!seen.has(nr + ',' + nc) && robot.move()) {",
            '        dfs(nr, nc, nd);',
            '        goBack();',
            '      }',
            '      robot.turnRight();',
            '    }',
            '  };',
            '  dfs(0, 0, 0);',
            '}',
            '',
            '// Provided wrapper, unchanged from the starter',
            'function cleanedRoom(room, row, col) {',
            '  const copy = room.map((r) => r.slice());',
            '  cleanRoom(new Robot(copy, row, col));',
            '  return copy;',
            '}',
          ],
        },
      },

      run([room, row, col]: [number[][], number, number], c) {
        const grid = room.map((r) => r.slice())
        const dirs = [
          [-1, 0],
          [0, 1],
          [1, 0],
          [0, -1],
        ]
        // the robot, as the scaffold provides it
        let rr = row
        let cc = col
        let dir = 0
        const move = () => {
          c.ops++
          const nr = rr + dirs[dir][0]
          const nc = cc + dirs[dir][1]
          if (nr < 0 || nc < 0 || nr >= grid.length || nc >= grid[0].length || grid[nr][nc] === 0) return false
          rr = nr
          cc = nc
          return true
        }
        const turnRight = () => {
          dir = (dir + 1) % 4
        }
        const seen = new Set<string>()
        const goBack = () => {
          turnRight()
          turnRight()
          move()
          turnRight()
          turnRight()
        }
        const dfs = (r: number, col2: number, d: number) => {
          seen.add(r + ',' + col2)
          grid[rr][cc] = 2
          for (let k = 0; k < 4; k++) {
            const nd = (d + k) % 4
            const nr = r + dirs[nd][0]
            const nc = col2 + dirs[nd][1]
            if (!seen.has(nr + ',' + nc) && move()) {
              dfs(nr, nc, nd)
              goBack()
            }
            turnRight()
          }
        }
        dfs(0, 0, 0)
        return grid
      },
    },
  ],
}
