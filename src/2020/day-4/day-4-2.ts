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
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-4/day-4-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-4/day-4-2.js


  notes
    The expected fields are as follows:

    byr (Birth Year) - four digits; at least 1920 and at most 2002.
    iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    hgt (Height) - a number followed by either cm or in:
        If cm, the number must be at least 150 and at most 193.
        If in, the number must be at least 59 and at most 76.
    hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    pid (Passport ID) - a nine-digit number, including leading zeroes.
    cid (Country ID) - ignored, missing or not.



  Answer:
	 179

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

    const input = rawInput
      .map(line => line.replace(/\n/g, ' ').split(' '))
      .map(kvps => {
        const o: keyValueObject = {};
        let temp = kvps
          .map(function(kvp) {
            const [key, value] = kvp.split(':');
            return [key, value];
          })
          .reduce(function(state, line) {
            let [key, value] = line;
            state[key] = value;
            return state;
          }, o);
        return temp;
      });
    //console.log(input);

    const validPassports = input.filter(function(passport) {
      return keys.every(key => {
        return passport.hasOwnProperty(key.key)
      });
    }).filter(function (passport) {
		return keys.every(key => {
			return key.validator(passport[key.key]);
		})
    });

    //console.log(validPassports);

    console.log({ answer: validPassports.length });

    endTerminalBlock();
  })();
}

interface keyValueObject {
  [key: string]: string;
}

const keys = [
  {
    key: 'byr',
    label: 'birth year',
    required: true,
    validator: function(value: string) {
      let numValue = Number(value);
      return !isNaN(numValue) && numValue >= 1920 && numValue <= 2002;
    },
  },
  {
    key: 'iyr',
    label: 'issue year',
    required: true,
    validator: function(value: string) {
      let numValue = Number(value);
      return !isNaN(numValue) && numValue >= 2010 && numValue <= 2020;
    },
  },
  {
    key: 'eyr',
    label: 'expiration year',
    required: true,
    validator: function(value: string) {
      let numValue = Number(value);
      return !isNaN(numValue) && numValue >= 2020 && numValue <= 2030;
    },
  },
  {
    key: 'hgt',
    label: 'height',
    required: true,
    validator: function(value: string) {
      let split = [...value];
      let numValue = Number(split.slice(0, split.length - 2).join(''));
      let units = split.slice(split.length - 2, split.length).join('');

      if (units === 'cm') {
        return numValue >= 150 && numValue <= 193;
      } else if (units === 'in') {
        return numValue >= 59 && numValue <= 76;
      }
      return false;
    },
  },
  {
    key: 'hcl',
    label: 'hair color',
    required: true,
    validator: function(value: string) {
      return value.match(/^\#[a-f0-9]{6}$/) !== null;
    },
  },
  {
    key: 'ecl',
    label: 'eye color',
    required: true,
    validator: function(value: string) {
      return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value);
    },
  },
  {
    key: 'pid',
    label: 'passport id',
    required: true,
    validator: function(value: string) {
      return value.match(/^\d{9}$/) !== null;
    },
  },
];

/*
===============================================================================
UNIT TESTS - only runs when unit testing
===============================================================================
*/
if (isRunningUnitTests()) {
  let expect = chai.expect;
  let assert = chai.assert;

  testSuite(function() {
    test('test height validator', async function() {
      const x = keys.find(key => key.key === 'hgt');
      if (x) {
        console.log(x.validator('58in'));
        console.log(x.validator('128cm'));
      } else {
        console.log('woops');
      }
    });
  }, __filename);
}
