import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
} from '../utils/utils';
import * as fs from 'fs';

const year = 2018;
const day = 3;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-3/day-3-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-3/day-3-2.js


  Answer: 
	#775
  Rank; 

  Notes: 
   TIL that Array.fill, if passed an object (like new Set()) will fill all with a _reference_ to that object instead of creating a new one each time...
   :facepalm:




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
    const { matrix, moreThanOne } = claims.reduce(
      function({ matrix, moreThanOne }, claim) {
        return drawRectOnMatrix(matrix, claim.rect, claim.id, moreThanOne);
      },
      { matrix: createEmptyMatrix(1000, 1000), moreThanOne: new Set() as Set<string> }
    );

    fs.writeFileSync(`./src/${year}/day-${day}/matrix-debug.txt`, outputMatrix(matrix));
    console.log({ answer: claims.filter(claim => !moreThanOne.has(claim.id)) });

    endTerminalBlock();
  })();
}

interface point {
  x: number;
  y: number;
}
interface rect {
  topLeft: point;
  bottomRight: point;
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

type matrix = Set<string>[][];

function createEmptyMatrix(width: number, height: number): matrix {
  return Array(width + 1)
    .fill([])
    .map(() => Array(height + 1).fill(undefined));
}

function drawRectOnMatrix(
  matrix: matrix,
  rect: rect,
  id: string,
  moreThanOneSet: Set<string>
): { matrix: matrix; moreThanOne: Set<string> } {
  for (let x = rect.topLeft.x; x <= rect.bottomRight.x; x++) {
    for (let y = rect.topLeft.y; y >= rect.bottomRight.y; y--) {
      if (matrix[x][y] === undefined) {
        matrix[x][y] = new Set();
      }
      matrix[x][y].add(id);
      if (matrix[x][y].size > 1) {
        matrix[x][y].forEach(id => moreThanOneSet.add(id));
      }
    }
  }
  return { matrix, moreThanOne: moreThanOneSet };
}

// @todo: write function to output matrix to console - consider adding a way to slice it
function outputMatrix(matrix: matrix): string {
  let output = '';
  for (let x = 0; x < matrix.length; x++) {
    output += matrix[x].map(y => (y === undefined || y.size === 0 ? '.' : y.size > 9 ? '#' : y.size)).join('') + '\n';
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

  testSuite(function() {}, __filename);
}
