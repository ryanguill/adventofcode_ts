import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
} from '../utils/utils';

const year = 2018;
const day = 1;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-1/day-1-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-1/day-1-2.js


  Answer: 70357
 
  Rank   00:18:01   693      0

  Notes: this took me entirely too long.  not filtering out the empty line at the 
  bottom gave me a false positive and hung me up for a while.  Then realized that I 
  needed to loop the inputs.
    
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
    let seen = new Set();
    let state = 0;
    outer: while (true) {
      for (let current of lines) {
        const freq = state + Number(current);
        state = freq;
        //console.log({ state, current, l: seen.size, x: seen.has(freq), freq });
        if (seen.has(freq)) {
          console.log({ answer: freq });
          break outer;
        } else {
          seen.add(freq);
        }
      }
    }

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
