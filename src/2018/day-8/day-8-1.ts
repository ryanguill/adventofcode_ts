import chai = require('chai');

import {
  isRunningUnitTests,
  testSuite,
  readInput,
  splitLines,
  beginTerminalBlock,
  endTerminalBlock,
} from '../utils/utils';

const year = 2018;
const day = 8;

/*

  execute solution:
    clear && npm run compile && time node --trace-warnings --async-stack-traces dist/2018/day-8/day-8-1.js

  unit test
    clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2018/day-8/day-8-1.js


  Answer: 
	38780
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

    const data = (await readInput({ year, day, overwrite: false })).split(' ').map(Number);
    //const data = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'.split(' ').map(Number);
    //console.log({ data: data.slice(0, 100) });

    let stack: node[] = [];
    for (let index = 0; index < data.length; index++) {
      let current = stack.pop() || makeEmptyNode();

      if (current.childrenLength === undefined) {
        current.childrenLength = data[index];
        stack.push(current);
        //console.log({ a: 'setChildLength', index, current, v: data[index] });
        continue;
      }
      if (current.metadataLength === undefined) {
        current.metadataLength = data[index];
        stack.push(current);
        if (current.children.length < current.childrenLength) {
          stack.push(makeEmptyNode());
        }
        //console.log({ a: 'setMetadataLength', index, current, v: data[index] });
        continue;
      }

      if (current.metadata.length < current.metadataLength) {
        current.metadata.push(data[index]);
        //console.log({ a: 'addMetadata', index, current, v: data[index] });
        if (current.metadata.length === current.metadataLength) {
          const parent = stack.pop();
          if (parent) {
            parent.children.push(current);
            //console.log({ a: 'addNodeToParent', index, parent, v: data[index] });
            stack.push(parent);
            if (parent.children.length < (parent.childrenLength || 0)) {
              stack.push(makeEmptyNode()); //start the next node
            }
          } else {
            // current is parent, nothing to do?
            stack.push(current);
          }

          continue;
        } else {
          stack.push(current);
          //console.log({ a: 'moreMDToAdd', index, current });
          continue;
        }
      }
    }

    const [root] = stack;

    //console.log(JSON.stringify(root, null, 2));

    console.log({ answer: sumMetadata(0, root) });

    endTerminalBlock();
  })();
}

function makeEmptyNode() {
  return {
    childrenLength: undefined,
    metadataLength: undefined,
    children: [],
    metadata: [],
  };
}

type node = {
  childrenLength?: number;
  metadataLength?: number;
  children: node[];
  metadata: number[];
};

function sumMetadata(total: 0, node: node): number {
  return total + node.metadata.reduce((a, b) => a + b, 0) + node.children.reduce(sumMetadata, 0);
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
