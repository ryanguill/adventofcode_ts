import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  deepClone,
} from '../utils/utils';

const year = 2018;
const day = 5;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-5/day-5-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-5/day-5-2.js


  Answer: 
	4952
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

    let originalData = (await readInput({ year, day, overwrite: false })).split('');

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const results: { letter: string; count: number }[] = [];
    for (let letter of letters) {
      let data = deepClone(originalData).filter(l => l !== letter && l !== letter.toUpperCase());

      while (true) {
        //console.log(data.length);
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
          break;
        }
      }
      results.push({ letter, count: data.length });
    }

    const smallest = results.sort((a, b) => a.count - b.count)[0];

    console.log({ answer: smallest });

    endTerminalBlock();
  })();
}

function isLowerCase(str: string) {
  return str == str.toLowerCase() && str != str.toUpperCase();
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
