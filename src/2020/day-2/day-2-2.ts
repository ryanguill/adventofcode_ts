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
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-2/day-2-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-2/day-2-2.js


  Answer:
    562


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
      .map(row => ({ char: row[2], pos1: Number(row[0]) - 1, pos2: Number(row[1]) - 1, password: row[3] }))
      .map(row => ({ ...row, split: [...row.password] }))
      .filter(row => {
        return (
          (row.split[row.pos1] === row.char || row.split[row.pos2] === row.char) &&
          !(row.split[row.pos1] === row.char && row.split[row.pos2] === row.char)
        );
      }).length;

    console.log({ answer });

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
