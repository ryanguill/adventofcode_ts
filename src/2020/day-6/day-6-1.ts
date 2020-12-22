import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  sum
} from '../utils/utils';

const year = 2020;
const day = 6;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-6/day-6-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-6/day-6-1.js


  notes



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

    let rawInput = (await readInput({ year, day, overwrite: false })).split('\n\n')

	let answer = rawInput.map(str => new Set([...str.replace(/\n/g, '')])).map(set => set.size).reduce(sum);

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
