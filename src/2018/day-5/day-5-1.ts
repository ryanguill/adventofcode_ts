import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  outputMatrixPng,
  transpose,
  matrix,
  pngFilesToGif,
} from '../utils/utils';

import { chunk } from 'lodash';

const year = 2018;
const day = 5;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-5/day-5-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-5/day-5-1.js


  Answer: 
	9462
  Rank; 

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

    let data = (await readInput({ year, day, overwrite: false })).split('');

    let iterations = 0;
    while (true) {
      //console.log(data.length);
      if (iterations % 100 === 0) {
        writePng(data, iterations);
      }
      iterations++;
      let somethingRemoved = false;
      let prevChar = '';
      for (let index = data.length - 1; index >= 0; --index) {
        let currentChar = data[index];
        //console.log({ currentChar, prevChar, data });
        if (isOppositeCase(prevChar, currentChar)) {
          //console.log('removing', prevChar, currentChar);
          data.splice(index, 2);
          //console.log('after', data);
          prevChar = '';
          somethingRemoved = true;
        } else {
          prevChar = currentChar;
        }
      }

      if (!somethingRemoved) {
        writePng(data, iterations);
        break;
      }
    }

    console.log({ answer: data.length });

    await pngFilesToGif({
      pngFilesGlob: `./src/${year}/day-${day}/png/matrix-debug-0.png`,
      width: 250,
      height: 200,
      outputFilename: `./src/${year}/day-${day}/png/matrix-debug.gif`,
    });

    endTerminalBlock();
  })();
}

function writePng(data: string[], suffix: number) {
  outputMatrixPng(
    transpose(
      chunk(
        data.map(char => char.charCodeAt(0) - 65),
        250
      )
    ),
    `./src/${year}/day-${day}/png/matrix-debug-${suffix}.png`,
    250,
    200
  );
}

function isLowerCase(str: string) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}
function isOppositeCase(a: string, b: string) {
  return (
    a.toLowerCase() === b.toLowerCase() && ((isLowerCase(a) && !isLowerCase(b)) || (isLowerCase(b) && !isLowerCase(a)))
  );
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
    test('isLowerCase', function() {
      expect(isLowerCase('a')).to.equal(true);
      expect(isLowerCase('b')).to.equal(true);
      expect(isLowerCase('c')).to.equal(true);
      expect(isLowerCase('A')).to.equal(false);
      expect(isLowerCase('B')).to.equal(false);
      expect(isLowerCase('C')).to.equal(false);
      expect(isLowerCase('5')).to.equal(false);
      expect(isLowerCase('')).to.equal(false);
    });
    test('isOppositeCase', function() {
      expect(isOppositeCase('a', 'A')).to.equal(true);
      expect(isOppositeCase('A', 'a')).to.equal(true);
      expect(isOppositeCase('A', 'A')).to.equal(false);
      expect(isOppositeCase('a', 'a')).to.equal(false);
      expect(isOppositeCase('a', 'b')).to.equal(false);
      expect(isOppositeCase('B', 'C')).to.equal(false);
      expect(isOppositeCase('', 'X')).to.equal(false);
      expect(isOppositeCase('', 'x')).to.equal(false);
      expect(isOppositeCase('5', '5')).to.equal(false);
    });
  }, __filename);
}
