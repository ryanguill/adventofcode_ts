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
const day = 8;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-8/day-8-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-8/day-8-1.js


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

    let input = (await readInput({ year, day, overwrite: false }))
      .split('\n')
      .map(parseLine);

    console.log(exec(input));

    endTerminalBlock();
  })();
}

function parseLine (input:string) : [string, number] {
	const parts = input.split(' ')
	const [instruction, value] = parts;
	return [instruction, parseInt(value, 10)]
}

function exec(instructions: [string, number][]) {
  let current_line: number = 0;
  const executed_lines: number[] = [];
  let acc = 0;

  /*
* nop +0  | 1
acc +1  | 2, 8(!)
jmp +4  | 3
acc +3  | 6
jmp -3  | 7
acc -99 |
acc +1  | 4
jmp -4  | 5
acc +6  |

First, the nop +0 does nothing. Then, the accumulator is increased from 0 to 1 (acc +1) and jmp +4 sets the next instruction to the other acc +1 near the bottom. After it increases the accumulator from 1 to 2, jmp -4 executes, setting the next instruction to the only acc +3. It sets the accumulator to 5, and jmp -3 causes the program to continue back at the first acc +1.
* */

  while (true) {
    if (!executed_lines.includes(current_line)) {
      executed_lines.push(current_line);
      let [current_instruction, instruction_value] = instructions[current_line];
      if (current_instruction === 'nop') {
        //do nothing, advance one line
        current_line += 1;
      } else if (current_instruction === 'acc') {
        //increase the accumulator by the instruction_value
        acc += instruction_value;
        current_line += 1;
      } else if (current_instruction === 'jmp') {
        //nothing happens to the accumulator, but
        // we advance the current_line
        current_line += instruction_value;
      }
    } else {
      return acc;
    }
  }
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
