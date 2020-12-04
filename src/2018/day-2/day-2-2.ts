import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  combine,
  levenshtein,
  head,
  zip,
} from '../utils/utils';

const year = 2018;
const day = 2;

/*

  execute solution:
    clear && npm run compile && time node dist/day-2/day-2-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/day-2/day-2-2.js


  Answer: 
	cvqlbidheyujgtrswxmckqnap

  Rank; 
	12:14:02  13312      0
  Notes: 
	again a silly mistake (using = instead of ==) slowed me down, but again feel good about my instincts
	and approach.  wasnt _certain_ that levenshtein was what I wanted, but glad to see that it was.  Surprised
	that I didnt already have a function for it.

	Also suprising that part 2 didnt really have anything to do with part 1, the solutions were completely different.

	I feel like there is a better way to get the final answer here, to filter out the characters in two strings - maybe
	what I want to do is have a function that would combine the two char for char in position and then filter where those
	are the same...


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

    let [similarA, similarB] = head(
      combine(lines, 2, 2).filter(function(combo) {
        const [a, b] = combo;
        return levenshtein(a, b) == 1;
      })
    );

    const answer = zip([similarA.split(''), similarB.split('')])
      .filter(combo => combo[0] === combo[1])
      .map(combo => combo[0])
      .join('');

    console.log({ answer });

    endTerminalBlock();
  })();
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
