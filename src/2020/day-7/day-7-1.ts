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
const day = 7;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2020/day-7/day-7-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/day-7/day-7-1.js


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

    let rawInput = (await readInput({ year, day, overwrite: false })).split(
      '\n'
    );

    let input = rawInput
      .map(parseLine)
      .reduce(function(acc, { container, elements }) {
        acc.set(container, elements);
        return acc;
      }, new Map() as Map<string, element[]>);

    const answer = [...input.entries()].filter(([container, elements]) =>
      contains(input, container, 'shiny gold')
    );

    console.log(answer.length);

    endTerminalBlock();
  })();
}

type element = [number, string];
interface parsed {
  container: string;
  elements: element[];
}

function parseLine(line: string): parsed {
  const regexp = new RegExp(/(\d+) (\w+ \w+) bags?/g);
  const matches = `1 ${line}`.matchAll(regexp);
  let [[_1, _2, container], ...elements] = [...matches];
  let elementsParsed = [...elements].map(
    ([_, n, element]) => [Number(n), element] as element
  );
  return { container, elements: elementsParsed };
}

function contains(
  data: Map<string, element[]>,
  container: string,
  targetColor: string
): any {
  const elements = data.get(container) || [];
  return elements.some(([n, element]) => {
    return element === targetColor || contains(data, element, targetColor);
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
    test('parseLine', async function() {
      const result = parseLine(
        'clear lime bags contain 2 plaid coral bags, 1 light lavender bag, 4 posh salmon bags.'
      );

      expect(result).to.deep.equal({
        container: 'clear lime',
        elements: [
          [2, 'plaid coral'],
          [1, 'light lavender'],
          [4, 'posh salmon'],
        ],
      });
    });
  }, __filename);
}
