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
const day = 2;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-2/day-2-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-2/day-2-1.js


  Answer:
    398


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

    const answer = lines
      .map(x =>
        x
          .replace(':', '')
          .replace('-', ' ')
          .split(' ')
      )
      .map(row => ({ char: row[2], min: Number(row[0]), max: Number(row[1]), password: row[3] }))
      .map(row => ({ ...row, count: row.password.length - row.password.replace(new RegExp(row.char, 'g'), '').length }))
      .filter(row => row.count >= row.min && row.count <= row.max).length;

    console.log({answer})

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
