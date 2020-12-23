import mocha = require('mocha');
import chai = require('chai');

import crypto = require('crypto');
import fs = require('fs');
import { PNG } from 'pngjs';
const request = require('request');

let expect = chai.expect;
let assert = chai.assert;

export interface keyValueObject {
  [key: string]: string;
}

export function randRange(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// npm run compile && ./node_modules/.bin/mocha --ui tdd dist/2020/utils/utils.js

export const isRunningUnitTests = () =>
  process.argv.length > 1 && process.argv[1].includes('mocha');
export const getUnitTestLabel = (filename: string) =>
  `${filename.split('/').reverse()[0]} tests`;
export const testSuite = (
  f: () => void,
  filename: string = __filename,
  label: string = getUnitTestLabel(filename)
) => isRunningUnitTests() && mocha.suite(label, f);

export function combine<T>(input: T[], min: number, max: number): T[][] {
  var out: T[][] = [];
  min = Math.max(min, 0);
  max = Math.max(min, Math.min(max, input.length));

  const fn = function(n: number, src: T[], acc: T[], out: T[][]) {
    if (n === 0) {
      if (acc.length > 0) {
        out[out.length] = acc;
      }
      return;
    }
    for (let j = 0; j < src.length; j++) {
      fn(n - 1, src.slice(j + 1), acc.concat([src[j]]), out);
    }
    return;
  };

  for (let i = min; i <= max; i++) {
    fn(i, input, [], out);
  }
  return out;
}

testSuite(function() {
  test('combine', async function() {
    assert.deepEqual(combine([1, 2, 3], 1, 1), [[1], [2], [3]]);
    assert.deepEqual(combine([1, 2, 3], 1, 2), [
      [1],
      [2],
      [3],
      [1, 2],
      [1, 3],
      [2, 3],
    ]);
    assert.deepEqual(combine([1, 2, 3], 2, 2), [
      [1, 2],
      [1, 3],
      [2, 3],
    ]);
    assert.deepEqual(combine([1, 2, 3], 1, 3), [
      [1],
      [2],
      [3],
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 2, 3],
    ]);
    assert.deepEqual(combine([1, 2, 3], 3, 3), [[1, 2, 3]]);
    assert.deepEqual(combine([1, 2, 3], 3, 10), [[1, 2, 3]]);
    assert.deepEqual(combine([1, 2, 3], -10, 10), [
      [1],
      [2],
      [3],
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 2, 3],
    ]);
  });
});

export type Point = [number, number];
export function manhattanDistance(p1: Point, p2: Point): number {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

testSuite(function() {
  test('manhattanDistance', async function() {
    assert.equal(manhattanDistance([1, 1], [2, 2]), 2);
    assert.equal(manhattanDistance([0, 0], [0, 10]), 10);
    assert.equal(manhattanDistance([0, 0], [10, 0]), 10);
  });
});

export function deepClone<T>(input: T): T {
  return JSON.parse(JSON.stringify(input));
}

testSuite(function() {
  test('deepClone', async function() {
    assert.deepEqual(deepClone({ a: 1, b: 2, c: 3 }), { a: 1, b: 2, c: 3 });
    //more tests needed
  });
});

//currying signatures
export function take<T>(count: number): (x: T[]) => T[];
export function take<T>(count: number, input: T[]): T[];
export function take<T>(count: number, input?: T[]) {
  if (!input) {
    return (x: T[]): T[] => take(count, x);
  }
  return input.slice(0, Math.max(0, count));
}

testSuite(function() {
  test('take', async function() {
    // tbd
  });
});

//currying signatures
export function pluck(key: string): (x: Object) => any;
export function pluck(key: string, input: { [key: string]: any }): any;
export function pluck(
  key: string,
  input?: { [key: string]: any }
): any | undefined {
  if (!input) {
    return function(input: { [key: string]: any }): any | undefined {
      return pluck(key, input);
    };
  }
  if (input.hasOwnProperty(key)) {
    return input[key];
  }
  return undefined;
}

testSuite(function() {
  test('pluck', async function() {
    // tbd
  });
});

export function sum(a: number, b: number) {
  return a + b;
}

testSuite(function() {
  test('sum', async function() {
    // tbd
  });
});

export function md5Hash(input: string): string {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex');
}

testSuite(function() {
  test('md5Hash', async function() {
    // tbd
  });
});

export function md5HashStretched(input: string, count: number): string {
  let hash = md5Hash(input);
  for (var i = 1; i < count; i++) {
    hash = md5Hash(hash);
  }
  return hash;
}

testSuite(function() {
  test('md5HashStretched', async function() {
    // tbd
  });
});

export function sha1(input: string): string {
  return crypto
    .createHash('sha1')
    .update(input)
    .digest('hex');
}

testSuite(function() {
  test('sha1', async function() {
    expect(sha1('foo')).to.equal('0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33');
  });
});

export function sha256(input: string): string {
  return crypto
    .createHash('sha256')
    .update(input)
    .digest('hex');
}

testSuite(function() {
  test('sha256', async function() {
    expect(sha256('foo')).to.equal(
      '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
    );
  });
});

export function sha512(input: string): string {
  return crypto
    .createHash('sha512')
    .update(input)
    .digest('hex');
}

testSuite(function() {
  test('sha512', async function() {
    expect(sha512('foo')).to.equal(
      'f7fbba6e0636f890e56fbbf3283e524c6fa3204ae298382d624741d0dc6638326e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'
    );
  });
});

export function head<T>(input: T[]): T {
  return input[0];
}

testSuite(function() {
  test('head', async function() {
    assert.equal(head([1]), 1);
    assert.equal(head([2, 3, 4]), 2);
    assert.equal(head([]), undefined);
  });
});

export function tail<T>(input: T[]): T[] {
  return input.slice(1, input.length);
}

testSuite(function() {
  test('tail', async function() {
    assert.deepEqual(tail([1, 2, 3, 4]), [2, 3, 4]);
    assert.deepEqual(tail([1, 2, 3, 4, 5, 6]), [2, 3, 4, 5, 6]);
    assert.deepEqual(tail([1]), []);
    assert.deepEqual(tail([]), []);
  });
});

export function equal<T>(input: T): (x: T) => boolean;
export function equal<T>(input: T, test: T): boolean;
export function equal<T>(input: T, test?: T) {
  if (test) {
    return input === test;
  } else {
    return function(test: T): boolean {
      return input === test;
    };
  }
}

testSuite(function() {
  test('equal', async function() {
    assert.isFunction(equal('foo'));
    assert.isTrue(equal('foo')('foo'));
    assert.isTrue(equal('foo', 'foo'));
    assert.isFalse(equal('foo')('bar'));
    assert.isFalse(equal('foo', 'bar'));
  });
});

export function trim(input: string) {
  return input.trim();
}

testSuite(function() {
  test('trim', async function() {
    // tbd
  });
});

type TimesF = (i: number) => any;
export function times(count: number): (x: TimesF) => any[];
export function times(count: number, f: TimesF): any[];
export function times(
  count: number,
  f?: TimesF
): ((x: TimesF) => any[]) | any[] {
  if (!f) {
    return function(f: TimesF): any[] {
      return times(count, f);
    };
  }
  const output = [];
  for (let i = 0; i < count; i++) {
    output.push(f(i));
  }
  return output;
}

testSuite(function() {
  test('times', async function() {
    // tbd
  });
});

export function rotateArray<T>(input: T[], backwards: boolean = false): T[] {
  let out = deepClone(input);
  if (out.length === 0) {
    return out;
  }
  if (backwards) {
    let x = out.shift();
    out.push(x!);
  } else {
    let x = out.pop();
    out.unshift(x!);
  }
  return out;
}

testSuite(function() {
  test('rotateArray<T>', async function() {
    assert.deepEqual(rotateArray([]), []);
    assert.deepEqual(rotateArray([1]), [1]);
    assert.deepEqual(rotateArray([1, 2]), [2, 1]);
    assert.deepEqual(rotateArray([1, 2, 3]), [3, 1, 2]);
    assert.deepEqual(rotateArray([1, 2, 3, 4]), [4, 1, 2, 3]);

    assert.deepEqual(rotateArray([], true), []);
    assert.deepEqual(rotateArray([1], true), [1]);
    assert.deepEqual(rotateArray([1, 2], true), [2, 1]);
    assert.deepEqual(rotateArray([1, 2, 3], true), [2, 3, 1]);
    assert.deepEqual(rotateArray([1, 2, 3, 4], true), [2, 3, 4, 1]);
  });
});

export function transpose<T>(input: T[][]): T[][] {
  return input[0].map((x, i) => input.map(y => y[i]));
}

testSuite(function() {
  test('transpose', async function() {
    let input = [
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 1],
    ];

    assert.deepEqual(transpose(input), [
      [1, 0, 0, 0],
      [1, 1, 0, 1],
      [1, 0, 1, 1],
      [0, 0, 0, 1],
    ]);
  });
});

export function countOnBitsInNumber(input: number): number {
  let x = Math.floor(input); //make sure we have an int
  let count: number =
    x - ((x >> 1) & 0o33333333333) - ((x >> 2) & 0o11111111111);
  return ((count + (count >> 3)) & 0o30707070707) % 63;
}

testSuite(function() {
  test('countOnBitsInNumber', async function() {
    assert.equal(countOnBitsInNumber(42), 3);
    assert.equal(countOnBitsInNumber(0), 0);
    assert.equal(countOnBitsInNumber(1), 1);
    assert.equal(countOnBitsInNumber(2), 1);
    assert.equal(countOnBitsInNumber(3), 2, Number(3).toString(2));
    assert.equal(countOnBitsInNumber(4), 1, Number(4).toString(2));
  });
});

export function neighbors4([x, y]: Point): Point[] {
  return [
    [x, y + 1],
    [x + 1, y],
    [x, y - 1],
    [x - 1, y],
  ];
}

export function neighbors8([x, y]: Point): Point[] {
  return [
    [x, y + 1],
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
  ];
}

testSuite(function() {
  test('countOnBitsInNumber', async function() {
    assert.deepEqual(neighbors4([1, 1]), [
      [1, 2],
      [2, 1],
      [1, 0],
      [0, 1],
    ]);

    assert.lengthOf(neighbors4([1, 1]), 4);
  });
});

export function readInput({
  year,
  day,
  overwrite = false,
}: {
  year: number;
  day: number;
  overwrite?: boolean;
}): Promise<string> {
  const sessionId =
    '53616c7465645f5f1a7f2f45f0bd458383c7ee9ab45fc3fc42d20b4125ce7acb6802097735d467c9a0d43b951e48d494';
  const filename = `./src/${year}/day-${day}/input.txt`;

  //if the file already exists and has a value use that instead
  return new Promise(function(resolve, reject) {
    if (fs.existsSync(filename) && !overwrite) {
      const data = fs.readFileSync(filename).toString();
      if (data.length) {
        console.log(`Reading existing data from ${filename}... ${data.length}`);
        return resolve(data);
      }
    }

    request(
      {
        method: 'get',
        uri: `http://adventofcode.com/${year}/day/${day}/input`,
        headers: { Cookie: `session=${sessionId}` },
      },
      (err: any, res: any, body: any) => {
        if (err) {
          return reject(err);
        }
        if (res.statusCode === 200) {
          console.log(
            `Year ${year} Day ${day} input written to ${filename}... ${body.length}`
          );
          fs.writeFileSync(filename, body.trim());
          return resolve(body.trim());
        } else {
          return reject(body);
        }
      }
    );
  });
}

export function grep(pattern: RegExp | string, lines: string[]): string[] {
  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern, 'gi');
  }
  return lines.filter(line => line.match(pattern) !== null);
}

testSuite(function() {
  test('grep', async function() {
    const data = ['one', 'two', 'three', 'four', 'five'];
    expect(grep(/x/gi, data)).to.eql([]);
    expect(grep('x', data)).to.eql([]);
    expect(grep('o', data)).to.eql(['one', 'two', 'four']);
    expect(grep(/ive/gi, data)).to.eql(['five']);
  });
});

export function beginTerminalBlock({
  year,
  day,
}: {
  year: number;
  day: number;
}) {
  console.log(
    '--------------------------------------------------------------------------------'
  );
  console.log(
    `---------------------------------- ${year} ----------------------------------------`
  );
  console.log(
    `---------------------------------- Day ${day} ---------------------------------------`
  );
  console.log(
    '--------------------------------------------------------------------------------'
  );
  console.log(`\n\n`);
}

export function endTerminalBlock() {
  console.log(`\n\n`);
  console.log(
    '--------------------------------------------------------------------------------'
  );
  console.log(
    '--------------------------------------------------------------------------------'
  );
  console.log(
    '--------------------------------------------------------------------------------'
  );
  console.log(
    '--------------------------------------------------------------------------------'
  );
}

export function memoize(f: Function): any {
  const memo = new Map();
  return function(key: string) {
    if (!memo.has(key)) {
      memo.set(key, f(key));
    }
    return memo.get(key);
  };
}

testSuite(function() {
  test('memoize', function() {
    const f = (x: any) => Math.random();

    const mf = memoize(f);

    const a = mf(1);
    const b = mf(2);
    const c = mf(3);
    expect(mf(1)).to.equal(a);
    expect(mf(2)).to.equal(b);
    expect(mf(3)).to.equal(c);
  });
});

// https://github.com/jsoendermann/defaultdict-proxy
export function defaultDict(defaultValue: any): any {
  return new Proxy(
    {},
    {
      get(target: any, property: string) {
        if (target[property] !== undefined) {
          return target[property];
        }

        switch (typeof defaultValue) {
          case 'undefined':
          case 'boolean':
          case 'number':
          case 'string':
          case 'symbol':
            target[property] = defaultValue;
            break;
          case 'function':
            target[property] = defaultValue(property);
            break;
          case 'object':
            if (defaultValue === null) {
              target[property] = null;
              break;
            }
            if (Array.isArray(defaultValue)) {
              target[property] = [...defaultValue];
              break;
            }
            target[property] = { ...defaultValue };
            break;
          default:
            throw new TypeError(`Unnkown type ${typeof defaultValue}`);
        }

        return target[property];
      },
    }
  );
}

testSuite(function() {
  test('defaultDict', function() {
    const dd = defaultDict(0);
    expect(dd.x).to.equal(0);
    dd.y = 2;
    expect(dd.y).to.equal(2);
  });
});

export function splitLines(
  input: string,
  options?: { filterEmptyLines: boolean }
): string[] {
  options = options || { filterEmptyLines: true };
  let lines = input.split('\n');
  if (options.filterEmptyLines) {
    lines = lines.filter(line => line.trim().length > 0);
  }
  return lines;
}

export function* cycle(iterable: any) {
  let buffer = [];
  for (let item of iterable) {
    yield item;
    buffer.push(item);
  }
  if (buffer.length === 0) {
    return;
  }
  while (true) {
    yield* buffer;
  }
}

testSuite(function() {
  test('cycle', function*() {
    expect(take(10, yield cycle([1, 2, 3]))).to.eql([
      1,
      2,
      3,
      1,
      2,
      3,
      1,
      2,
      3,
      1,
    ]);
  });
});

//https://gist.github.com/andrei-m/982927
export function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let tmp, i, j, prev, val, row;
  // swap to save some memory O(min(a,b)) instead of O(a)
  if (a.length > b.length) {
    tmp = a;
    a = b;
    b = tmp;
  }

  row = Array(a.length + 1);
  // init the row
  for (i = 0; i <= a.length; i++) {
    row[i] = i;
  }

  // fill in the rest
  for (i = 1; i <= b.length; i++) {
    prev = i;
    for (j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        val = row[j - 1]; // match
      } else {
        val = Math.min(
          row[j - 1] + 1, // substitution
          Math.min(
            prev + 1, // insertion
            row[j] + 1
          )
        ); // deletion
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }
  return row[a.length];
}

testSuite(function() {
  test('levenshtein', function() {
    expect(levenshtein('house', 'house')).to.equal(0);
    expect(levenshtein('aaaaa', 'aabaa')).to.equal(1);
    expect(levenshtein('aaaab', 'aaaba')).to.equal(2);
  });
});

// take n arrays and return a new array of the length == the max length of the input arrays
// and return a tuple of the elements at each position
export function zip(inputs: any[][]): any[] {
  //find the max length array
  const output = [];
  const longest = Math.max.apply(
    null,
    inputs.map(input => input.length)
  );

  for (let index = 0; index < longest; index += 1) {
    const element = [];
    for (let input of inputs) {
      element.push(input[index]);
    }
    output.push(element);
  }

  return output;
}

testSuite(function() {
  test('zip', function() {
    expect(
      zip([
        [1, 2, 3],
        ['a', 'b', 'c', 'd'],
      ])
    ).to.deep.equal([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
      [undefined, 'd'],
    ]);
  });
});

export type matrix = any[][];

export interface point {
  x: number;
  y: number;
}
export interface rect {
  topLeft: point;
  bottomRight: point;
}

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

testSuite(function() {
  test('hexToRgb', function() {
    expect(hexToRgb('#000000')).to.deep.equal({ r: 0, g: 0, b: 0 });
  });
});

export function numberToColor(n: number): string {
  const colors = [
    '#000000',
    '#00FF00',
    '#0000FF',
    '#FF0000',
    '#01FFFE',
    '#FFA6FE',
    '#FFDB66',
    '#006401',
    '#010067',
    '#95003A',
    '#007DB5',
    '#FF00F6',
    '#FFEEE8',
    '#774D00',
    '#90FB92',
    '#0076FF',
    '#D5FF00',
    '#FF937E',
    '#6A826C',
    '#FF029D',
    '#FE8900',
    '#7A4782',
    '#7E2DD2',
    '#85A900',
    '#FF0056',
    '#A42400',
    '#00AE7E',
    '#683D3B',
    '#BDC6FF',
    '#263400',
    '#BDD393',
    '#00B917',
    '#9E008E',
    '#001544',
    '#C28C9F',
    '#FF74A3',
    '#01D0FF',
    '#004754',
    '#E56FFE',
    '#788231',
    '#0E4CA1',
    '#91D0CB',
    '#BE9970',
    '#968AE8',
    '#BB8800',
    '#43002C',
    '#DEFF74',
    '#00FFC6',
    '#FFE502',
    '#620E00',
    '#008F9C',
    '#98FF52',
    '#7544B1',
    '#B500FF',
    '#00FF78',
    '#FF6E41',
    '#005F39',
    '#6B6882',
    '#5FAD4E',
    '#A75740',
    '#A5FFD2',
    '#FFB167',
    '#009BFF',
    '#E85EBE',
  ];
  return colors[n % colors.length];
}

testSuite(function() {
  test('numberToColor', function() {
    expect(numberToColor(0)).to.equal('#000000');
  });
});

export function outputMatrixPng(
  matrix: matrix,
  filename: string,
  width: number = matrix.length,
  height: number = matrix[0].length
): void {
  const png = new PNG({
    width: width,
    height: height,
    filterType: -1,
    colorType: 2, //color, no alpha
    bgColor: { red: 255, green: 255, blue: 255 },
  });

  for (let x = 0; x < matrix.length; x++) {
    //output += matrix[x].map(x => (x === 0 ? '.' : x > 9 ? '#' : x)).join('') + '\n';
    for (let y = 0; y < matrix[x].length; y++) {
      let idx = (png.width * y + x) << 2;
      const { r, b, g } = hexToRgb(numberToColor(matrix[x][y]));
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = 255; //opacity
    }
  }

  png.pack().pipe(fs.createWriteStream(filename));
}

export async function pngFilesToGif({
  pngFilesGlob,
  width,
  height,
  outputFilename,
  repeat = -1,
  delay = 500,
  quality = 10,
}: {
  pngFilesGlob: string;
  width: number;
  height: number;
  outputFilename: string;
  repeat?: number;
  delay?: number;
  quality?: number;
}) {
  const GIFEncoder = require('gifencoder');
  const encoder = new GIFEncoder(width, height);
  const pngFileStream = require('png-file-stream');
  var fs = require('fs');

  console.log(pngFilesGlob, fs.existsSync(pngFilesGlob));
  var stream = pngFileStream(pngFilesGlob);

  //.pipe(encoder.createWriteStream({ repeat, delay, quality }))
  //.pipe(fs.createWriteStream(outputFilename));

  // Alternately, you can wrap the "finish" event in a Promise
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

export function least(a: number, b: number) {
  if (a < b) {
    return a;
  }
  return b;
}

// @todo test least, especially what happens when a is undefined

export function greatest(a: number, b: number) {
  if (a > b) {
    return a;
  }
  return b;
}

// @todo test greatest, especially what happens when a is undefined

export function createEmptyMatrix(
  width: number,
  height: number,
  defaultValue: any
): matrix {
  return Array(width)
    .fill(defaultValue)
    .map(() => Array(height).fill(defaultValue));
}

export function mapMatrix(
  matrix: matrix,
  fn: (point: point, value: any) => any
): matrix {
  const output = deepClone(matrix);
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      output[x][y] = fn({ x, y }, output[x][y]);
    }
  }
  return output;
}

export function reduceMatrix<T>(
  matrix: matrix,
  fn: (accumulator: T, point: point, value: any) => any,
  initial: T
): T {
  let output = initial;
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      output = fn(output, { x, y }, matrix[x][y]);
    }
  }
  return output;
}

export function matrixToText(
  matrix: matrix,
  fn: (point: point, value: any) => any
): string {
  let output = '';
  for (let x = 0; x < matrix.length; x++) {
    output += matrix[x].map((value, y) => fn({ x, y }, value)).join('') + '\n';
  }
  return output;
}

//todo figure out how to type this
export function cartesian(...a: any): any {
  return a.reduce(function<T>(a: T[], b: T[]) {
    return a.flatMap(d => b.map(e => [d, e].flat()));
  });
}

// clear && npm run compile && ./node_modules/.bin/mocha --ui tdd dist/utils/utils.js

export function intersect<T>(...sets: Set<T>[]) {
  if (!sets.length) {
    return new Set();
  }
  const i = sets.reduce((m, s, i) => (s.size < sets[m].size ? i : m), 0);
  const [smallest] = sets.splice(i, 1);
  const res = new Set();
  for (let val of smallest) {
    if (sets.every(s => s.has(val))) {
      res.add(val);
    }
  }
  return res;
}

export function chunk<T>(input: T[], size: number): T[][] {
  return partition(input, size);
}

export function partition<T>(input: T[], n: number, step: number = n): T[][] {
  const output = [];
  for (let idx = 0; idx < input.length; idx += step) {
    output.push(input.slice(idx, idx + n));
  }
  return output;
}

export function freq<T>(input: T[]): Map<T, number> {
  const output = new Map<T, number>();
  for (let x of input) {
    output.set(x, (output.get(x) || 0) + 1);
  }
  return output;
}

testSuite(function() {
  test('chunk', async function() {
    let x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    expect(chunk(x, 2)).to.deep.equal([
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
    ]);
    expect(chunk(x, 3)).to.deep.equal([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
  });

  test('partition', async function() {
    let x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    expect(partition(x, 2)).to.deep.equal([
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
    ]);
    expect(partition(x, 2, 1)).to.deep.equal([
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
      [9],
    ]);
  });

  test('freq', async function() {
    let x = [1, 2, 2, 3, 3, 3];
    expect([...freq(x).entries()]).to.deep.equal([
      [1, 1],
      [2, 2],
      [3, 3],
    ]);
  });
}, __filename);
