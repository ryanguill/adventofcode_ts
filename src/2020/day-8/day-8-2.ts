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
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-8/day-8-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-8/day-8-2.js


  notes



  Answer:
    826 is too low




*/

/*
===============================================================================
Get Input and main function run - wont run when unit testing
===============================================================================
*/
if (!isRunningUnitTests()) {
  (async function main() {
    beginTerminalBlock({ year, day });

    const originalInstructions = (
      await readInput({ year, day, overwrite: false })
    )
      .split('\n')
      .map(parseLine);

    console.log(originalInstructions[2]);

    let afterIndex = 0;
    while (true) {
      let changeInstructionsResult = changeInstruction(
        JSON.parse(JSON.stringify(originalInstructions)),
        afterIndex
      );
      const instructions = changeInstructionsResult.instructions;
      if (changeInstructionsResult.index === undefined) {
        console.log('shouldnt happen, ran out of options');
        break;
      }
      console.log(
        changeInstructionsResult.index,
        instructions[changeInstructionsResult.index],
        originalInstructions[changeInstructionsResult.index]
      );

      afterIndex = changeInstructionsResult.index;

      const result = exec(instructions);
      if (result !== undefined) {
        console.log({ answer: result });
        break;
      }
    }

    endTerminalBlock();
  })();
}

function parseLine(input: string): [string, number] {
  const parts = input.split(' ');
  const [instruction, value] = parts;
  return [instruction, parseInt(value, 10)];
}

/*change the next nop -> jmp or jmp -> nop after the index provided*/
function changeInstruction(
  instructions: [string, number][],
  afterIndex: number
) {
  const index = instructions.findIndex(
    ([instruction], index) =>
      index > afterIndex && ['nop', 'jmp'].includes(instruction)
  );

  console.log(index, instructions[index][0]);
  if (index === -1) {
    console.log('shouldn`t happen');
    return { instructions, index: undefined };
  } else if (instructions[index][0] === 'nop') {
    instructions[index][0] = 'jmp';
  } else {
    instructions[index][0] = 'nop';
  }
  return { instructions, index };
}

function exec(instructions: [string, number][]) {
  let current_line: number = 0;
  const executed_lines: number[] = [];
  let acc = 0;

  while (true) {
    if (!executed_lines.includes(current_line)) {
      executed_lines.push(current_line);
      if (current_line > instructions.length - 1) {
        console.log('terminated!');
        return acc;
      }
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
      return undefined;
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
