import chai = require('chai');

import { isRunningUnitTests, testSuite, readInput, beginTerminalBlock, endTerminalBlock } from '../utils/utils';

const year = 2018;
const day = 1;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-1/day-1-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-1/day-1-1.js


  Answer: freq 490

  Rank: 00:02:37   361      0

  Notes: this one went pretty well, not nearly fast enough to get on the leaderboard
  (Rank 361) but overall was pretty happy with this one.

  my new function to automatically get the input worked well.
    
*/

/*
===============================================================================
Get Input and main function run - wont run when unit testing
===============================================================================	
*/
if (!isRunningUnitTests()) {
  (async function main() {
    beginTerminalBlock({ year, day });

    const input = await readInput({ year, day, overwrite: true });
    console.log(
      'freq',
      input.split('\n').reduce(function(freq, current) {
        return freq + Number(current);
      }, 0)
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
