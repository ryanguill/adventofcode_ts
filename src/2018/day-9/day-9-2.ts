import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  head,
} from '../utils/utils';

const year = 2018;
const day = 9;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-9/day-9-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-9/day-9-2.js


  Answer: 
	
  Rank; 

  Notes: 
	This solution is __way__ too slow.  I let it run for 21 minutes before I killed it.
	I need to implement a proper double-linked-list to do this properly.  I dont have the time at the moment
	and didnt quickly find a slam dunk implementation on npm that did everything I need.

	something like python's deque https://docs.python.org/2/library/collections.html#collections.deque
	would be perfect, with their rotate
*/

/*
===============================================================================
Get Input and main function run - wont run when unit testing
===============================================================================	
*/
if (!isRunningUnitTests()) {
  (async function main() {
    beginTerminalBlock({ year, day });

    const input = '431 players; last marble is worth 7095000 points';
    console.log({ answer: playGame(431, 7095000) });

    endTerminalBlock();
  })();
}

function playGame(playerCount: number, lastMarbleValue: number): number {
  let board: number[] = [0];
  let playerScores = Array(playerCount).fill(0);

  let marbleIndex = 1;
  let currentMarble = 1;
  outer: while (true) {
    for (let playerIndex = 0; playerIndex < playerCount; ++playerIndex) {
      if (marbleIndex % 23 === 0) {
        let sevenBackIndex = getCounterClockwiseIndex(board, currentMarble, 7);
        //console.log(marbleIndex, board[sevenBackIndex], sevenBackIndex);
        playerScores[playerIndex] += marbleIndex + board[sevenBackIndex];

        currentMarble = sevenBackIndex;
        board.splice(sevenBackIndex, 1);
      } else {
        let insertionIndex = getClockwiseIndex(board, currentMarble, 2);
        board.splice(insertionIndex, 0, marbleIndex);
        currentMarble = insertionIndex;
      }

      marbleIndex += 1;
      //console.log(printBoard(board, currentMarble));
      if (marbleIndex > lastMarbleValue) {
        break outer;
      }
    }
  }

  playerScores.sort();
  //console.log(playerScores);
  return head(playerScores.reverse());
}

function getClockwiseIndex(board: number[], currentIndex: number, distance: number) {
  if (currentIndex > board.length) {
    console.error({ boardLength: board.length, currentIndex });
    throw new Error('invalid current index');
  }
  let newIndex = currentIndex + (distance - 1);
  if (newIndex > board.length - 1) {
    //wrap around
    newIndex = newIndex % board.length;
  }
  return newIndex + 1;
}

function getCounterClockwiseIndex(board: number[], currentIndex: number, distance: number) {
  if (currentIndex > board.length) {
    console.error({ boardLength: board.length, currentIndex });
    throw new Error('invalid current index');
  }
  let newIndex = currentIndex - distance;
  if (newIndex < 0) {
    let moddedDistanceFromEnd = Math.abs(newIndex) % board.length;
    if (moddedDistanceFromEnd === 0) {
      newIndex = 0;
    } else {
      //wrap around
      newIndex = board.length - (Math.abs(newIndex) % board.length);
    }
  }
  return newIndex;
}

function printBoard(board: number[], currentMarble: number): string {
  return board.map((x, index) => (index === currentMarble ? '(' + x + ')' : x)).join(', ');
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
    test.only('playGame', async function() {
      expect(playGame(9, 25)).to.equal(32);
      expect(playGame(10, 1618)).to.equal(8317);
      expect(playGame(13, 7999)).to.equal(146373);
      expect(playGame(17, 1104)).to.equal(2764);
      expect(playGame(21, 6111)).to.equal(54718);
      expect(playGame(30, 5807)).to.equal(37305);
    });

    test('getClockwiseIndex', function() {
      expect(getClockwiseIndex([0], 0, 2)).to.equal(1);
      expect(getClockwiseIndex([0, 1], 1, 2)).to.equal(1);
      expect(getClockwiseIndex([0, 1, 2], 1, 2)).to.equal(3);
      expect(getClockwiseIndex([0, 1, 2, 3], 0, 2)).to.equal(2);
    });

    test('getCounterClockwiseIndex', function() {
      expect(getCounterClockwiseIndex([0, 1, 2, 3, 4, 5, 6, 7], 7, 7)).to.equal(0);
      expect(getCounterClockwiseIndex([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10, 7)).to.equal(3);
      expect(getCounterClockwiseIndex([0, 1, 2, 3], 3, 10)).to.equal(1);
      expect(getCounterClockwiseIndex([0, 1, 2, 3], 3, 7)).to.equal(0);
    });
  }, __filename);
}
