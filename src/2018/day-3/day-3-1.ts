import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  outputMatrixPng,
  rect,
  matrix,
  point,
} from '../utils/utils';
import * as fs from 'fs';

const year = 2018;
const day = 3;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-3/day-3-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-3/day-3-1.js


  Answer: 
    139030 too high
  Rank; 

  Notes: 
    rectangle = [left, top, width, height]
    #123 @ 3,2: 5x4
    
    > How many square inches of fabric are within two or more claims?

    where I am: I dont really need to know if they do overlap, I need to know the coordinates of the overlap.
      still not sure how to approach finding the distinct area that is within multiple claims

    changing approach, going to create a 1000x1000 matrix and "draw" the shapes on the matrix, each pixel
    being the count of rectangles overlapping.




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
    const claims = lines.map(parseClaim);

    //console.log(claims.map(claim => claim.rect));
    const matrix = claims.reduce(function(matrix, claim) {
      return drawRectOnMatrix(matrix, claim.rect);
    }, createEmptyMatrix(1000, 1000));

    fs.writeFileSync(`./src/${year}/day-${day}/matrix-debug.txt`, outputMatrix(matrix));
    outputMatrixPng(matrix, `./src/${year}/day-${day}/matrix-debug.png`);
    console.log({ answer: findAreaInMatrixWithOverlap(matrix, 2) });

    endTerminalBlock();
  })();
}

interface claim {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rect: rect;
}

function parseClaim(input: string): claim {
  const [id, _at, pos, dim] = input.trim().split(' ');
  const [left, top] = pos.replace(':', '').split(',');
  const [width, height] = dim.split('x');

  const output = { id, left: Number(left), top: Number(top), width: Number(width), height: Number(height) };

  const topLeft = { x: 0 + output.left, y: 1000 - output.top };
  const bottomRight = { x: topLeft.x + (output.width - 1), y: topLeft.y - (output.height - 1) };
  const rect = { topLeft, bottomRight };
  return { ...output, rect };
}

// function doesOverlap(r1: rect, r2: rect): boolean {
//   if (r1.topLeft.x > r2.bottomRight.x || r1.bottomRight.x > r2.topLeft.x) {
//     return false;
//   }

//   if (r1.topLeft.y < r2.bottomRight.y || r1.bottomRight.y < r2.topLeft.y) {
//     return false;
//   }

//   return true;
// }

function createEmptyMatrix(width: number, height: number): matrix {
  return Array(width)
    .fill(0)
    .map(() => Array(height).fill(0));
}

function drawRectOnMatrix(matrix: matrix, rect: rect): matrix {
  for (let x = rect.topLeft.x; x <= rect.bottomRight.x; x++) {
    for (let y = rect.topLeft.y; y >= rect.bottomRight.y; y--) {
      matrix[x][y] = matrix[x][y] + 1;
    }
  }
  return matrix;
}

function findAreaInMatrixWithOverlap(matrix: matrix, threshold: number): number {
  const overlappingPoints: point[] = [];
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      if (matrix[x][y] >= threshold) {
        overlappingPoints.push({ x, y });
      }
    }
  }
  return overlappingPoints.length;
}

// @todo: write function to output matrix to console - consider adding a way to slice it
function outputMatrix(matrix: matrix): string {
  let output = '';
  for (let x = 0; x < matrix.length; x++) {
    output += matrix[x].map(x => (x === 0 ? '.' : x > 9 ? '#' : x)).join('') + '\n';
  }
  return output;
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
    test('drawRectOnMatrix', async function() {
      expect(
        drawRectOnMatrix(createEmptyMatrix(5, 5), { topLeft: { x: 2, y: 3 }, bottomRight: { x: 3, y: 2 } })
      ).to.deep.equal(
        // prettier-ignore
        [
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 1, 1, 0], 
            [0, 0, 1, 1, 0], 
            [0, 0, 0, 0, 0]
        ]
      );

      expect(
        drawRectOnMatrix(
          // prettier-ignore
          [
            [0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0], 
            [0, 0, 1, 1, 0], 
            [0, 0, 1, 1, 0], 
            [0, 0, 0, 0, 0]
          ],
          {
            topLeft: { x: 1, y: 2 },
            bottomRight: { x: 2, y: 1 },
          }
        )
      ).to.deep.equal(
        // prettier-ignore
        [
          [0, 0, 0, 0, 0], 
          [0, 1, 1, 0, 0], 
          [0, 1, 2, 1, 0], 
          [0, 0, 1, 1, 0], 
          [0, 0, 0, 0, 0]
        ]
      );
    });

    test('parseClaim', function() {
      expect(parseClaim('#123 @ 3,2: 5x4')).to.deep.equal({
        id: '#123',
        left: 3,
        top: 2,
        width: 5,
        height: 4,
        rect: { topLeft: { x: 3, y: 998 }, bottomRight: { x: 7, y: 995 } },
      });

      expect(parseClaim('#1142 @ 517,897: 22x10')).to.deep.equal({
        id: '#1142',
        left: 517,
        top: 897,
        width: 22,
        height: 10,
        rect: { topLeft: { x: 517, y: 103 }, bottomRight: { x: 538, y: 94 } },
      });
    });

    test('findAreaInMatrixWithOverlap', function() {
      expect(
        findAreaInMatrixWithOverlap(
          // prettier-ignore
          [
            [0, 0, 0, 0, 0], 
            [0, 1, 1, 0, 0], 
            [0, 1, 2, 1, 0], 
            [0, 0, 1, 1, 0], 
            [0, 0, 0, 0, 0]],
          1
        )
      ).to.equal(7);

      expect(
        findAreaInMatrixWithOverlap(
          // prettier-ignore
          [
            [0, 0, 0, 0, 0], 
            [0, 1, 1, 0, 0], 
            [0, 1, 2, 1, 0], 
            [0, 0, 1, 1, 0], 
            [0, 0, 0, 0, 0]],
          2
        )
      ).to.equal(1);
    });
  }, __filename);
}
