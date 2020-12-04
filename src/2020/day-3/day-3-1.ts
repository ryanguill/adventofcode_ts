import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  sum,
} from '../utils/utils';

const year = 2020;
const day = 3;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-3/day-3-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-3/day-3-1.js


  Answer:
    216


*/

/*
===============================================================================
Get Input and main function run - wont run when unit testing
===============================================================================
*/
if (!isRunningUnitTests()) {
  (async function main() {
    beginTerminalBlock({ year, day });

    let lines = splitLines(await readInput({ year, day, overwrite: false }));

    let input = lines.map(line => [...line])

	const answer = iter(input,[1,3])

	console.log({answer});

    endTerminalBlock();
  })();
}

function getCell (input: String[][], [v, h] : [number, number]) : String | undefined {
  const mapWidth = input[0].length
  if (input[v]) {
	  return input[v][h % mapWidth]
  }
  return undefined;
}



function iter (input: String[][], slope: [number, number], pos :[number, number] = [0,0]) {
  let [slopeV, slopeH] = slope;
  let treeCount = 0;
  let val = getCell(input, pos)
  while (val !== undefined) {
    if (val === '#') {
      treeCount += 1
    }
	pos = [pos[0] + slopeV, pos[1] + slopeH]
    val = getCell(input, pos)
  }
  return treeCount
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
