import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  head,
  tail,
  deepClone,
} from '../utils/utils';

const year = 2018;
const day = 7;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-7/day-7-2.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-7/day-7-2.js


  Answer: 
	980
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
    const instructions = lines.map(parseLine);
    const distinctSteps: string[] = Array.from(
      instructions.reduce(function(set: Set<string>, instr) {
        return set.add(instr.prereq);
      }, new Set() as Set<string>)
    ).sort();

    const treeMap: Map<string, string[]> = instructions.reduce(function(agg: Map<string, string[]>, instr) {
      if (!agg.has(instr.id)) {
        agg.set(instr.id, [instr.prereq]);
      } else {
        agg.set(instr.id, [instr.prereq, ...(agg.get(instr.id) || [])]);
      }
      return agg;
    }, new Map());

    distinctSteps.forEach(step => {
      if (!treeMap.has(step)) treeMap.set(step, []);
    });

    const sortedTree: step[] = sortTree(
      Array.from(treeMap).map(function(stepTuple) {
        const [id, prereqs] = stepTuple;
        return { id, prereqs, unfulfilledPrereqs: deepClone(prereqs), work: undefined };
      }),
      new Set()
    );

    const workers = [1, 2, 3, 4, 5].map((element, index) => {
      return { id: index, nextAvailableTick: 0 };
    });

    type iterationArgs = {
      currentTick: number;
      workers: worker[];
      durationPerWork?: number;
      completed?: Set<string>;
      sortedTree: step[];
      done: boolean;
    };

    function iterate({
      currentTick,
      workers,
      durationPerWork = 60,
      completed = new Set(),
      sortedTree,
    }: iterationArgs): iterationArgs {
      //check what workers are done
      //the worker is done, so add what they were doing to the completed and set them up for the next thing
      workers = workers.map(function(worker) {
        if (worker.nextAvailableTick <= currentTick && worker.work !== undefined) {
          completed.add(worker.work.id);
          worker.work = undefined;
        }
        return worker;
      });

      if (completed.size === 26 && workers.every(worker => worker.nextAvailableTick <= currentTick)) {
        return {
          currentTick: currentTick,
          workers,
          durationPerWork,
          completed,
          sortedTree,
          done: true,
        };
      }

      //check if there is a worker available.  If so, use it, if not advance the current tick
      const availableWorkers = workers.filter(worker => worker.nextAvailableTick <= currentTick);

      if (availableWorkers.length === 0) {
        return {
          currentTick: currentTick + 1,
          workers,
          durationPerWork,
          completed,
          sortedTree,
          done: false,
        };
      } else {
        sortedTree = sortTree(sortedTree, completed);
        let availableWork = sortedTree.filter(
          step =>
            step.unfulfilledPrereqs.length === 0 &&
            !workers.find(worker => worker.work !== undefined && worker.work.id === step.id)
        );

        workers = workers.map(function(worker) {
          if (worker.nextAvailableTick <= currentTick) {
            const nextAvailableWork = head(availableWork);
            if (nextAvailableWork !== undefined) {
              availableWork = tail(availableWork);
              worker.work = nextAvailableWork;
              worker.nextAvailableTick = currentTick + durationPerWork + (nextAvailableWork.id.charCodeAt(0) - 64);
              // remove the assigned work from the sorted tree
              sortedTree = sortedTree.filter(step => step.id !== nextAvailableWork.id);
            }
          }
          return worker;
        });

        return {
          currentTick: currentTick + 1,
          workers,
          completed,
          sortedTree,
          done: false,
        };
      }
    }

    let state: iterationArgs = { currentTick: 0, workers, sortedTree, done: false };
    while (state.done === false && state.currentTick < 10000) {
      state = iterate(state);
    }

    const { completed, currentTick, sortedTree: tree } = state;

    const answer = Array.from(completed || new Set()).join('');
    console.log({ answer: answer, l: answer.length, currentTick });

    endTerminalBlock();
  })();
}

type instruction = { prereq: string; id: string };
type step = { id: string; prereqs: string[]; unfulfilledPrereqs: string[] };
type worker = { id: number; nextAvailableTick: number; work?: step };

function consoleWorkers(workers: worker[]): object[] {
  return workers.map(worker => {
    return { id: worker.id, next: worker.nextAvailableTick, w: (worker.work || { id: '' }).id };
  });
}

function parseLine(line: string): instruction {
  const [prereq, id] = (line.match(/step\s[A-Z]/gi) || []).map(x => x.replace(/step\s/gi, ''));
  return { prereq, id };
}

function necessaryPrereq(completed: Set<string>, prereqs: string[]): string | undefined {
  return prereqs.find(prereq => !completed.has(prereq));
}

function sortTree(tree: step[], completed: Set<string>): step[] {
  tree = tree.map(function(step) {
    step.unfulfilledPrereqs = step.unfulfilledPrereqs.filter(prereq => !completed.has(prereq));
    return step;
  });
  return tree.sort(function(a, b) {
    if (a.unfulfilledPrereqs.length === b.unfulfilledPrereqs.length) {
      return a.id.charCodeAt(0) - b.id.charCodeAt(0);
    }
    return a.unfulfilledPrereqs.length - b.unfulfilledPrereqs.length;
  });
}

function consoleTree(tree: step[]): object[] {
  return tree.map(step => ({ id: step.id, p: step.prereqs.join(','), u: step.unfulfilledPrereqs.join(',') }));
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
