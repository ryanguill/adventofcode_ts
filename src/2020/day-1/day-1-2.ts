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
const day = 1;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-1/day-1-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-1/day-1-2.js


  Answer:
    160137

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

    const answer = input.map(x => iterCalc(0, x)).reduce(sum)

    console.log({answer})

    endTerminalBlock();
  })();
}

function calc (x:number) {
	const fuel = Math.floor(x/3)-2;
	return fuel <= 0 ? 0 : fuel
}

function iterCalc (sum:number | undefined, x:number) : number {
	sum = sum || 0;
	const fuel = calc(x);
	if (fuel > 0) {
		return iterCalc(sum+fuel, fuel);
	}
	return sum;
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
    test('iterCalc', async function() {
        expect(iterCalc(0, 0)).to.equal(0);
    });
  }, __filename);
}
