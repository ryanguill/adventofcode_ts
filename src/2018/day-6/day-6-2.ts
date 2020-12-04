import chai = require('chai');
import fs = require('fs');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  point,
  pluck,
  least,
  greatest,
  createEmptyMatrix,
  outputMatrixPng,
  mapMatrix,
  manhattanDistance,
  head,
  matrixToText,
  reduceMatrix,
  sum,
} from '../utils/utils';

const year = 2018;
const day = 6;

/*

  execute solution:
    clear && npm run compile && time node dist/day-6/day-6-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/day-6/day-6-2.js


  Answer: 
    42344
  Rank; 

  Notes: 

*/

/*
===============================================================================
Get Input and main function run - wont run when unit testing
===============================================================================	
*/
if (!isRunningUnitTests()) {
  (async function main() {
    beginTerminalBlock({ year, day });

    const lines = splitLines(await readInput({ year, day, overwrite: false }));

    const points: point[] = lines.map(line => {
      const [x, y] = line.split(', ');
      return { x: Number(x), y: Number(y) };
    });

    //const minX = points.map(pluck('x')).reduce(least);
    const maxX = points.map(pluck('x')).reduce(greatest);
    //const minY = points.map(pluck('y')).reduce(least);
    const maxY = points.map(pluck('y')).reduce(greatest);

    const maxOverall = Math.max(maxX, maxY) + 2;
    //console.log({ minX, maxX, minY, maxY, maxOverall });

    let matrix = createEmptyMatrix(maxOverall, maxOverall, 0);
    points.forEach((point, index) => (matrix[point.x][point.y] = index));

    //fs.writeFileSync(`./src/day-${day}/matrix-debug.txt`, outputMatrix(matrix));

    matrix = mapMatrix(matrix, function(currentPosition, value) {
      const totalDistance = points
        .map((point, index) => ({
          point,
          index,
          distance: manhattanDistance([point.x, point.y], [currentPosition.x, currentPosition.y]),
        }))
        .reduce(function(total, point) {
          return total + point.distance;
        }, 0);

      if (totalDistance < 10000) {
        return 1;
      }
      return 0;
    });

    //console.log({ edges });

    const answer = reduceMatrix(
      matrix,
      function(acc, point, value) {
        if (value === 1) {
          acc += 1;
        }
        return acc;
      },
      0
    );

    console.log({ answer });

    outputMatrixPng(matrix, `./src/day-${day}/matrix-debug.png`);

    fs.writeFileSync(
      `./src/day-${day}/matrix-debug.txt`,
      matrixToText(matrix, function(point, value) {
        return value === 0 ? '.' : 'X';
      })
    );

    endTerminalBlock();
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
    test('test example function', async function() {});
  }, __filename);
}
