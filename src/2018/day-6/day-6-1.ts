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
} from '../utils/utils';

const year = 2018;
const day = 6;

/*

  execute solution:
    clear && npm run compile && time node dist/day-6/day-6-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/day-6/day-6-1.js


  Answer: 
	4754
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
      const closestPoints = points
        .map((point, index) => ({
          point,
          index,
          distance: manhattanDistance([point.x, point.y], [currentPosition.x, currentPosition.y]),
        }))
        .sort((a, b) => a.distance - b.distance);

      if (closestPoints[0].distance === closestPoints[1].distance) {
        return -1;
      }
      return closestPoints[0].index;
    });

    //find all of the indexes at the edges and disqualify them
    const edges = reduceMatrix(
      matrix,
      function(acc, point, value) {
        if (point.x === 0 || point.x === maxOverall - 1) {
          acc.add(value);
        }
        if (point.y === 0 || point.y === maxOverall - 1) {
          acc.add(value);
        }
        return acc;
      },
      new Set()
    );

    //console.log({ edges });

    const counts = points
      .map((point, index) => {
        if (edges.has(index)) {
          return { point, index, id: String.fromCharCode(65 + index), count: 0 };
        } else {
          return {
            point,
            index,
            id: String.fromCharCode(65 + index),
            count: reduceMatrix(
              matrix,
              function(acc, currentPosition, value) {
                if (value === index) {
                  return acc + 1;
                }
                return acc;
              },
              0
            ),
          };
        }
      })
      .sort((a, b) => a.count - b.count)
      .reverse();

    console.log({ answer: counts[0] });

    outputMatrixPng(matrix, `./src/day-${day}/matrix-debug.png`);

    fs.writeFileSync(
      `./src/day-${day}/matrix-debug.txt`,
      matrixToText(matrix, function(point, value) {
        return String.fromCharCode(65 + value);
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
