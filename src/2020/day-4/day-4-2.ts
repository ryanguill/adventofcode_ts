import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
} from '../utils/utils';

const year = 2020;
const day = 4;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-4/day-4-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-4/day-4-2.js


  Answer:



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

	const answer = 42;

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
