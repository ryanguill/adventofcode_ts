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
const day = 9;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-9/day-9-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-9/day-9-1.js


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

    let large_input = (await readInput({ year, day, overwrite: false }))
      .split('\n')
      .map(x => parseInt(x, 10));

    const small_input = [
      35,
      20,
      15,
      25,
      47,
      40,
      62,
      55,
      65,
      95,
      102,
      117,
      150,
      182,
      127,
      219,
      299,
      277,
      309,
      576,
    ];



    function exec(input: number[], preamble_size: number) {
      for (
        let current_index = 1 + preamble_size;
        current_index <= input.length;
        current_index += 1
      ) {
        const slice = input
          .slice(current_index - preamble_size - 1, current_index)
          .reverse();

        const [target, ...window] = slice;
        window.sort();
        //console.log({target, slice: [current_index - preamble_size, current_index], window})
        const x = cartesian(window, window).filter(function([a, b]: [
          number,
          number
        ]) {
          return a < b && a + b === target;
        });
        if (x.length === 0) {
          return target;
        }
      }
    }

    //console.log(exec(small_input, 5));
    console.log(exec(large_input, 25));

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
    test('', async function() {});
  }, __filename);
}
