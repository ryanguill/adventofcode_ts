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
const day = 4;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-4/day-4-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-4/day-4-1.js


  notes
    The expected fields are as follows:

    byr (Birth Year)
    iyr (Issue Year)
    eyr (Expiration Year)
    hgt (Height)
    hcl (Hair Color)
    ecl (Eye Color)
    pid (Passport ID)
    cid (Country ID)


  Answer:
	204



*/

/*
===============================================================================
Get Input and main function run - wont run when unit testing
===============================================================================
*/
if (!isRunningUnitTests()) {
  (async function main() {
    beginTerminalBlock({ year, day });

    let rawInput = (await readInput({ year, day, overwrite: false })).split('\n\n');

    const input = rawInput.map(line =>
      line
        .replace(/\n/g, ' ')
        .split(' ')
        .map(field => {
          const [key, value] = field.split(':');
          const o: keyValueObject = {};
          o[key] = value;
          return o;
        })
    );
    //console.log(input);

    const requiredKeys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

    const validPassports = input.filter(function (passport) {
        return requiredKeys.every(key => passport.find(item => item.hasOwnProperty(key)))
    })

    console.log({ answer: validPassports.length });

    endTerminalBlock();
  })();
}

interface keyValueObject {
  [key: string]: string;
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
