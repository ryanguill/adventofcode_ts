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

const year = 2019;
const day = 2;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2019/day-2/day-2-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2019/day-2/day-2-1.js


  Answer:
    3765464


*/

/*
===============================================================================
Get Input and main function run - wont run when unit testing
===============================================================================
*/
if (!isRunningUnitTests()) {
  (async function main() {
    beginTerminalBlock({ year, day });

    const lines = await readInput({ year, day, overwrite: false });


	let program = lines.split(',').map(Number);

	program[1] = 12;
	program[2] = 2;



	const resultingProgram = run(program);
	console.log({answer: resultingProgram[0]})

// 3765464

    endTerminalBlock();
  })();
}

type op = [number, number, number, number]
type program = number[];
type opFnArgs = {currentOp: op, program: program}
type opFnReturn = {program: program, isRunning: boolean}

interface operationsMap {
	[key:number]: Function;
}

function run (program: number[]) {
  let current = 0;
  let isRunning = true;
  let operations : operationsMap = {
    1: function ({currentOp, program} : opFnArgs) : opFnReturn {
			const [_, a, b, output] = currentOp;
      program[output] = program[a] + program[b];
      return ({program, isRunning: true});
    },
    2: function ({currentOp, program} : opFnArgs) : opFnReturn  {
	    const [_, a, b, output] = currentOp;
      program[output] = program[a] * program[b];
      return ({program, isRunning: true});
    },
    99: function ({currentOp, program} : opFnArgs) : opFnReturn  {
     return ({program, isRunning: false});
    }
  };

  while (isRunning) {
    const currentOp = program.slice(current, current + 4);
    const result = operations[currentOp[0]]({currentOp, program});
    isRunning = result.isRunning;
    program = result.program;
    if (isRunning) {
      //if we are still running, advance 4 from last operation.
      current += 4;
    }
  }
  return program;
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
