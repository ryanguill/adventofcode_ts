import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
  head,
  deepClone,
} from '../utils/utils';

const year = 2018;
const day = 7;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-7/day-7-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-7/day-7-1.js


  Answer: 
	ACBDESULXKYZIMNTFGWJVPOHRQ
	
	
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
        return { id, prereqs, unfulfilledPrereqs: deepClone(prereqs) };
      }),
      new Set()
    );

    function iterate(completed: Set<string>, sortedTree: step[], currentStep?: step) {
      if (currentStep === undefined) {
        return completed;
      }
      sortedTree = sortTree(sortedTree, completed);

      const prereq = necessaryPrereq(completed, currentStep.prereqs);
      if (prereq === undefined) {
        completed.add(currentStep.id);

        sortedTree = sortTree(sortedTree.filter(step => step.id !== currentStep.id), completed);
        //console.log({ completing: currentStep.id, remaining: consoleTree(sortedTree) });
        iterate(completed, sortedTree, head(sortedTree));
      } else {
        //console.log({ needsToBeCompleted: currentStep.id, prereq });
        const prereqStep = sortedTree.find(function(step) {
          return step.id === prereq;
        });
        iterate(completed, sortedTree, prereqStep);
      }
      return completed;
    }

    const completed = iterate(new Set(), sortedTree, head(sortedTree));

    console.log({ answer: Array.from(completed).join('') });

    endTerminalBlock();
  })();
}

type instruction = { prereq: string; id: string };
type step = { id: string; prereqs: string[]; unfulfilledPrereqs: string[] };

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
