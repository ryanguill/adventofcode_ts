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
const day = 10;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-10/day-10-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-10/day-10-2.js


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

    let small_input = [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4];

    let medium_input = [
      28,
      33,
      18,
      42,
      31,
      14,
      46,
      20,
      48,
      47,
      24,
      23,
      49,
      45,
      19,
      38,
      39,
      11,
      1,
      32,
      25,
      35,
      8,
      17,
      7,
      9,
      4,
      2,
      34,
      10,
      3,
    ];

    function get_joltage_differences(input: number[]) {
      const get_device_joltage = (input: number[]) =>
        input.reduce((acc, x) => (acc > x ? acc : x), 0) + 3;

      input.push(0); //the starting input
      input.push(get_device_joltage(input)); //the final device input
      input.sort((a, b) => a - b);

      return partition(input, 2, 1)
        .filter(x => x.length === 2)
        .map(([a, b]) => b - a);
    }

    const count_ways = memoize(function(input: number[]): number {
      if (input.length === 1) {
        return 1;
      }
      const [a, b, ...xs] = input;

      if (a + b > 3) {
        return count_ways([b, ...xs]);
      } else {
        return count_ways([b, ...xs]) + count_ways([a + b, ...xs]);
      }
    })

    //console.log(count_ways(get_joltage_differences(small_input)));
    //console.log(count_ways(get_joltage_differences(medium_input)));
    console.log(count_ways(get_joltage_differences(large_input)));


    endTerminalBlock();
  })();
}

function chunk<T>(input: T[], size: number): T[][] {
  return partition(input, size);
}

function partition<T>(input: T[], n: number, step: number = n): T[][] {
  const output = [];
  for (let idx = 0; idx < input.length; idx += step) {
    output.push(input.slice(idx, idx + n));
  }
  return output;
}

function freq<T>(input: T[]): Map<T, number> {
  const output = new Map<T, number>();
  for (let x of input) {
    output.set(x, (output.get(x) || 0) + 1);
  }
  return output;
}

function memoize(f: Function): any {
  const memo = new Map();
  return function(input: number[]) {
    const key = input.join(',')
    if (!memo.has(key)) {
      memo.set(key, f(input));
    }
    return memo.get(key);
  };
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
    test('chunk', async function() {
      let x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      expect(chunk(x, 2)).to.deep.equal([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9],
      ]);
      expect(chunk(x, 3)).to.deep.equal([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
    });

    test('partition', async function() {
      let x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      expect(partition(x, 2)).to.deep.equal([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9],
      ]);
      expect(partition(x, 2, 1)).to.deep.equal([
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 8],
        [8, 9],
        [9],
      ]);
    });

    test('freq', async function() {
      let x = [1, 2, 2, 3, 3, 3];
      expect([...freq(x).entries()]).to.deep.equal([
        [1, 1],
        [2, 2],
        [3, 3],
      ]);
    });
  }, __filename);
}
