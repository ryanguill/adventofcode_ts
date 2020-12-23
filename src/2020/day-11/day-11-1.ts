import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  beginTerminalBlock,
  endTerminalBlock,
  matrixToText,
  md5Hash,
  matrix,
  neighbors8,
  mapMatrix,
  reduceMatrix,
  deepClone,
} from '../utils/utils';

const year = 2020;
const day = 11;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-11/day-11-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-11/day-11-1.js


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
      .map(x => x.split(''));

    let small_input = `
		L.LL.LL.LL
		LLLLLLL.LL
		L.L.L..L..
		LLLL.LL.LL
		L.LL.LL.LL
		L.LLLLL.LL
		..L.L.....
		LLLLLLLLLL
		L.LLLLLL.L
		L.LLLLL.LL
    `
      .split('\n')
      .map(line => line.trim().split(''));

    //console.log(matrixToText(small_input, (point, value) => value));
    //console.log(matrix_hash(small_input));

    //const final_matrix = exec_until_stable(small_input);
    const final_matrix = exec_until_stable(large_input);
    //console.log(matrixToText(step(final_matrix), (point, value) => value));
    console.log({ answer: count_occupied(final_matrix) });

    endTerminalBlock();
  })();
}

function exec_until_stable(matrix: matrix) {
  let steps = 0;
  let last_matrix = deepClone(matrix);
  let last_hash = matrix_hash(matrix);
  while (true) {
    steps += 1;
    matrix = step(matrix);
    const next_hash = matrix_hash(matrix);
    if (next_hash !== last_hash) {
      last_hash = next_hash;
      last_matrix = deepClone(matrix);
    } else {
      console.log(
        { steps, next_hash, last_hash }
        //matrixToText(matrix, (point, value) => value),
        //matrixToText(last_matrix, (point, value) => value)
      );

      break;
    }
    /*
    console.log(
      steps,
      matrixToText(step(matrix), (point, value) => value)
    );
    */
  }
  return matrix;
}

function count_occupied(matrix: matrix) {
  return reduceMatrix(
    matrix,
    function(acc, { x, y }, value) {
      if (value === '#') {
        return acc + 1;
      }
      return acc;
    },
    0
  );
}

function matrix_hash(matrix: matrix): string {
  return md5Hash(matrix.map(line => line.join('')).join(''));
}

function get_matrix_cell(
  matrix: matrix,
  x: number,
  y: number,
  default_value: any = undefined
) {
  if (matrix[x] === undefined) {
    return default_value;
  }
  if (matrix[x][y] === undefined) {
    return default_value;
  }
  return matrix[x][y];
}

function neighbor_count(matrix: matrix, x: number, y: number) {
  const neighbors = neighbors8([x, y]);
  //console.log({ x, y, neighbors });
  return neighbors.filter(function([x, y]) {
    return get_matrix_cell(matrix, x, y) === '#';
  }).length;
}

function step(matrix: matrix): matrix {
  /*

    If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
    Otherwise, the seat's state does not change.

Floor (.) never changes; seats don't move, and nobody sits on the floor.

     */
  return mapMatrix(matrix, function({ x, y }, value) {
    //console.log({x,y,value,nc: neighbor_count(matrix, x, y)})
    if (['L', '#'].includes(value)) {
      if (value === 'L' && neighbor_count(matrix, x, y) === 0) {
        return '#';
      } else if (value === '#' && neighbor_count(matrix, x, y) >= 4) {
        return 'L';
      }
    }
    return value;
  });
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
