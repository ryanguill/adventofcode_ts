import chai = require('chai');

import { isRunningUnitTests, testSuite, neighbors4, matrixToText, Point, randRange, md5Hash } from '../utils/utils';

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/nolans-math-problem-2020-12-04/index.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/nolans-math-problem-2020-12-04/index.js


	answer! {
  seen: [
    [ 0, 0 ], [ 1, 0 ],
    [ 1, 1 ], [ 1, 2 ],
    [ 2, 2 ], [ 3, 2 ],
    [ 3, 3 ], [ 3, 4 ],
    [ 2, 4 ], [ 2, 3 ],
    [ 1, 3 ], [ 1, 4 ],
    [ 1, 5 ], [ 1, 6 ],
    [ 0, 6 ]
  ]
}


answer! {
  seen: [
    [ 0, 0 ], [ 0, 1 ],
    [ 0, 2 ], [ 1, 2 ],
    [ 1, 1 ], [ 2, 1 ],
    [ 2, 2 ], [ 3, 2 ],
    [ 3, 3 ], [ 3, 4 ],
    [ 3, 5 ], [ 2, 5 ],
    [ 1, 5 ], [ 0, 5 ],
    [ 0, 6 ]
  ]
} [
56
90
15
64
62
54
61
84
81
95
50
60
36
99
72
]



*/

const grid = [
  [56, 90, 15, 48, 63, 99, 72],
  [40, 62, 64, 37, 76, 36, 49],
  [23, 54, 61, 80, 86, 60, 86],
  [72, 97, 84, 81, 95, 50, 75],
];

function getValue(grid: number[][], point: Point) {
  const [x, y] = point;
  if (x < 0 || x > grid.length - 1) {
    return undefined;
  }
  if (y < 0 || y > grid[0].length - 1) {
    return undefined;
  }
  return grid[x][y];
}

if (!isRunningUnitTests()) {
  (async function main() {
    console.log(
      matrixToText(grid, function(point, value) {
        //return ` ${value} `;
        return ` ${point.x},${point.y} `;
      })
    );

    console.log(
      matrixToText(grid, function(point, value) {
        return ` ${value} `;
        //return ` ${point.x},${point.y} `
      })
    );

    /*
         0,0  0,1  0,2  0,3  0,4  0,5  0,6
		 1,0  1,1  1,2  1,3  1,4  1,5  1,6
		 2,0  2,1  2,2  2,3  2,4  2,5  2,6
		 3,0  3,1  3,2  3,3  3,4  3,5  3,6

		 56  90  15  48  63  99  72
		 40  62  64  37  76  36  49
		 23  54  61  80  86  60  86
		 72  97  84  81  95  50  75


     */

    const start: Point = [0, 0];
    const end: Point = [0, 6];

    const target = 1000 - 4 - 17;
    let isRunning = true;
    const maxIterations = 10_000_000;
    let currentIteration = 0;
    let answerCount = 0;
    let answers: any[] = [];
    let tries: Set<string> = new Set();

    //try a random walk
    while (isRunning) {
      currentIteration += 1;
      if (currentIteration % 1_000_000 === 0) {
        console.log('starting new sim', currentIteration);
      }
      let total = 0;
      const seen: Point[] = [];
      let current = start;
      seen.push(start);

      total += getValue(grid, current) || 0;

      while (total < target) {
        const neighbors = neighbors4(current)
          .filter(p => getValue(grid, p) !== undefined)
          .filter(p => !seen.find(seenPoint => p[0] === seenPoint[0] && p[1] === seenPoint[1]));

        //console.log({ neighbors });

        if (neighbors.length === 0) {
          //console.log('no more neighbors to choose from');
          tries.add(md5Hash(seen.map(p => getValue(grid, p)).join(',')));
          break;
        }

        //pick a random direction
        const randIndex = randRange(0, neighbors.length - 1);

        current = neighbors[randIndex];
        //console.log({ current, total });
        total += getValue(grid, current) || 0;
        seen.push(current);

        if (total === target) {
          if (current[0] === end[0] && current[1] === end[1]) {
            let seenMap = seen.map(p => getValue(grid, p)).join(',');
            let seenHash = md5Hash(seenMap);

            if (!answers.find(answer => answer.seenHash === seenHash)) {
              answerCount += 1;
              answers.push({
                answerCount,
                currentIteration,
                seen: seen.map(p => `(${p[0]},${p[1]})`).join(', '),
                seenMap,
                seenHash,
              });
            }

            // console.log(
            //   'answer!',
            //   { answerCount, currentIteration, seen },
            //   seen.map(p => getValue(grid, p)).join('\n')
            // );
            //isRunning = false;

            tries.add(md5Hash(seen.map(p => getValue(grid, p)).join(',')));
            break;
          }
        } else if (total > target) {
          //console.log('too much...', total);
          tries.add(md5Hash(seen.map(p => getValue(grid, p)).join(',')));
          break;
        }
      }
      if (currentIteration >= maxIterations) {
        break;
      }
    }

    console.log(answers);
    console.log('tries', tries.size); // 24144, 24152 (2), 24155, 24173, 24315, 24321, 24328, 24329
  })();
}

/*
===============================================================================
UNIT TESTS - only runs when unit testing
===============================================================================
*/
if (isRunningUnitTests()) {
  let expect = chai.expect;
  let assert = chai.assert;

  testSuite(function() {
    test('test height validator', async function() {});
  }, __filename);
}
