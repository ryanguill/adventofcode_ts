import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  head,
  pluck,
} from '../utils/utils';
import * as fs from 'fs';

const year = 2018;
const day = 4;

/*

  execute solution:
    clear && npm run compile && time node dist/day-4/day-4-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/day-4/day-4-2.js


  Answer: 
    102095

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

    const lines = splitLines(await readInput({ year, day, overwrite: false }));

    const processed = processInput(lines);
    const mostSleep = [...processed.data.entries()]
      .map(entry => ({
        id: entry[0],
        minutes: entry[1],
        count: entry[1].length,
      }))
      .map(function(entry) {
        const freqMap = [
          ...entry.minutes
            .reduce(function(freqMap: Map<number, number>, minute) {
              freqMap.set(minute, (freqMap.get(minute) || 0) + 1);
              return freqMap;
            }, new Map())
            .entries(),
        ]
          .map(entry => ({ minute: entry[0], count: entry[1] }))
          .sort((a, b) => a.count - b.count)
          .reverse();
        return { ...entry, mostFreqMinute: freqMap[0] };
      })
      .filter(x => x.mostFreqMinute !== undefined)
      .sort((a, b) => a.mostFreqMinute.count - b.mostFreqMinute.count)
      .reverse()[0];

    console.log({ answer: mostSleep.id * mostSleep.mostFreqMinute.minute });

    endTerminalBlock();
  })();
}

interface record {
  date: string;
  time: string;
  dt: Date;
  unixtime: number;
  action: 'ID' | 'SLEEP' | 'WAKE';
  id?: number;
}
interface state {
  currentId?: number;
  currentSleep?: number;
  data: Map<number, number[]>;
}

function processInput(lines: string[]) {
  const sortedLines = lines
    .map(function(line) {
      return line.replace(/[\[\]]/gi, '');
    })
    .map(function(line): record {
      const [date, time, action, id] = line.split(' ');
      return {
        date,
        time,
        dt: new Date(Date.parse(date + ' ' + time)),
        unixtime: Date.parse(date + ' ' + time),
        action: action === 'Guard' ? 'ID' : action === 'falls' ? 'SLEEP' : 'WAKE',
        id: action === 'Guard' ? Number(id.replace(/[^\d]/gi, '')) : undefined,
      };
    })
    .sort((a, b) => a.unixtime - b.unixtime);

  //fs.writeFileSync(`./src/day-${day}/records-debug.txt`, sortedLines.map(x => JSON.stringify(x)).join('\n'));
  return sortedLines.reduce(
    function(state: state, record: record) {
      state.currentId = state.currentId || 0;
      switch (record.action) {
        case 'ID':
          state.currentId = record.id || 0;

          state.data.set(state.currentId, state.data.get(state.currentId) || []);
          break;
        case 'SLEEP':
          state.currentSleep = record.dt.getMinutes();
          break;
        case 'WAKE':
          const start = state.currentSleep || 0;
          const current = state.data.get(state.currentId) || [];
          for (let minute = start; minute < record.dt.getMinutes(); minute++) {
            current.push(minute);
          }
          state.data.set(state.currentId, current);
          state.currentSleep = undefined;
          break;
      }

      return state;
    },
    { currentId: undefined, currentSleep: undefined, data: new Map() }
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
    test('test example function', async function() {});
  }, __filename);
}
