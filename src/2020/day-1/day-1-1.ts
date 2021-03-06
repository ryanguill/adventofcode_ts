import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  cartesian,
} from '../utils/utils';

const year = 2020;
const day = 1;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-1/day-1-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-1/day-1-1.js


  Answer:
		381699
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

    const input = lines.map(Number);

    const combined: number[][] = cartesian(input, input);
    const added = combined.filter(([a, b]) => a + b === 2020);
    const [a, b] = added[0];
    const answer = a * b;


    console.log({answer});

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
