import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  defaultDict,
} from '../utils/utils';

const year = 2018;
const day = 2;

/*

  execute solution:
    clear && npm run compile && time node dist/day-2/day-2-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/day-2/day-2-1.js


  Answer: 
	62500 too high - problem was find returns "undefined" not "null" if no element is found
	6642

  Rank; 
	11:58:35  15595      0
  Notes: 
	I didnt work on this till the next morning.

	Made some silly mistakes in this, although I feel good about my instincts and approach.

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

    const twos = lines.filter(function(line) {
      return (
        Array.from(countOccurrances(line).entries()).find(function(entry) {
          const [key, value] = entry;
          return value === 2;
        }) !== undefined
      );
    }).length;

    const threes = lines.filter(function(line) {
      return (
        Array.from(countOccurrances(line).entries()).find(function(entry) {
          const [key, value] = entry;
          return value === 3;
        }) !== undefined
      );
    }).length;

    console.log({ twos, threes, answer: twos * threes });

    endTerminalBlock();
  })();
}

function countOccurrances(input: string | string[]): Map<string, number> {
  if (!Array.isArray(input)) {
    input = input.split('');
  }
  const output = new Map();
  for (const c of input) {
    if (!output.has(c)) {
      output.set(c, 1);
    } else {
      output.set(c, output.get(c) + 1);
    }
  }
  //console.log(input, output);
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

  testSuite(function() {
    test('test example function', async function() {});
  }, __filename);
}
