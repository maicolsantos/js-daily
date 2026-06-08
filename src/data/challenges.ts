import { Challenge } from '../types/challenge'

export const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Flatten Nested Array',
    slug: 'flatten-nested-array',
    difficulty: 'easy',
    description: `Given a nested array of any depth, return a new flat array containing all the values.

Do **not** use \`Array.prototype.flat()\` or \`Array.prototype.flatMap()\`.`,
    examples: [
      { input: '[1, [2, 3], [4, [5, 6]]]', output: '[1, 2, 3, 4, 5, 6]' },
      { input: '[[1, [2]], [3, [4, [5]]]]', output: '[1, 2, 3, 4, 5]' },
    ],
    constraints: [
      'Array elements are numbers or nested arrays of numbers.',
      'No built-in flat() or flatMap() allowed.',
    ],
    starterCode: `function flatten(arr) {
  // your code here
}`,
    starterCodeTS: `function flatten(arr: any[]): number[] {
  // your code here
}`,
    testCases: [
      { input: [[1, [2, 3], [4, [5, 6]]]], expected: [1, 2, 3, 4, 5, 6], label: 'Basic nested array' },
      { input: [[[1, [2]], [3, [4, [5]]]]], expected: [1, 2, 3, 4, 5], label: 'Deep nesting' },
      { input: [[1, 2, 3]], expected: [1, 2, 3], label: 'Already flat' },
      { input: [[[[[[42]]]]]], expected: [42], label: 'Single deeply nested value' },
    ],
    solution: `function flatten(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}`,
  },
  {
    id: '2',
    title: 'Debounce Function',
    slug: 'debounce',
    difficulty: 'medium',
    description: `Implement a \`debounce(fn, delay)\` function.

The debounced function delays invoking \`fn\` until \`delay\` milliseconds have elapsed since the last time it was called. Repeated calls within the delay period reset the timer.`,
    examples: [
      {
        input: 'debounce(fn, 300)',
        output: 'Returns a function that calls fn only after 300ms of inactivity',
      },
    ],
    constraints: [
      'The returned function should accept any arguments and pass them to fn.',
      'Each new call resets the timer.',
    ],
    starterCode: `function debounce(fn, delay) {
  // your code here
}`,
    starterCodeTS: `function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  // your code here
}`,
    testCases: [
      {
        input: [null, 100],
        expected: 'function',
        label: 'Returns a function',
      },
    ],
    solution: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
  },
  {
    id: '3',
    title: 'Deep Clone Object',
    slug: 'deep-clone',
    difficulty: 'medium',
    description: `Implement a \`deepClone(obj)\` function that creates a deep copy of an object or array.

The clone must be completely independent — mutating the clone should not affect the original.

Do **not** use \`JSON.parse(JSON.stringify())\`, \`structuredClone()\`, or external libraries.`,
    examples: [
      {
        input: '{ a: 1, b: { c: 2 } }',
        output: '{ a: 1, b: { c: 2 } } (new reference)',
        explanation: 'Modifying clone.b.c does not change original.b.c',
      },
    ],
    constraints: ['Handle plain objects, arrays, numbers, strings, booleans, null.', 'No JSON.parse/stringify or structuredClone.'],
    starterCode: `function deepClone(obj) {
  // your code here
}`,
    starterCodeTS: `function deepClone<T>(obj: T): T {
  // your code here
}`,
    testCases: [
      { input: [{ a: 1, b: { c: 2 } }], expected: { a: 1, b: { c: 2 } }, label: 'Nested object' },
      { input: [[1, [2, 3], { x: 4 }]], expected: [1, [2, 3], { x: 4 }], label: 'Mixed array' },
      { input: [42], expected: 42, label: 'Primitive number' },
      { input: [null], expected: null, label: 'Null value' },
    ],
    solution: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepClone(v)]));
}`,
  },
  {
    id: '4',
    title: 'Group By Key',
    slug: 'group-by-key',
    difficulty: 'easy',
    description: `Implement \`groupBy(arr, key)\` that groups an array of objects by a given property key.

Returns an object where each key is a unique value of the property and each value is an array of items with that property.`,
    examples: [
      {
        input: "[{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }], 'type'",
        output: "{ a: [{ type: 'a', val: 1 }, { type: 'a', val: 3 }], b: [{ type: 'b', val: 2 }] }",
      },
    ],
    constraints: ['key is always a valid string property of each object.'],
    starterCode: `function groupBy(arr, key) {
  // your code here
}`,
    starterCodeTS: `function groupBy<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T[]> {
  // your code here
}`,
    testCases: [
      {
        input: [[{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }], 'type'],
        expected: { a: [{ type: 'a', val: 1 }, { type: 'a', val: 3 }], b: [{ type: 'b', val: 2 }] },
        label: 'Group by type',
      },
      {
        input: [[{ age: 20, name: 'Alice' }, { age: 20, name: 'Bob' }, { age: 30, name: 'Carol' }], 'age'],
        expected: { '20': [{ age: 20, name: 'Alice' }, { age: 20, name: 'Bob' }], '30': [{ age: 30, name: 'Carol' }] },
        label: 'Group by age',
      },
    ],
    solution: `function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key];
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});
}`,
  },
  {
    id: '5',
    title: 'Memoize',
    slug: 'memoize',
    difficulty: 'medium',
    description: `Implement \`memoize(fn)\` that caches the results of a function call.

If the function is called again with the same arguments, return the cached result without re-executing \`fn\`.`,
    examples: [
      {
        input: 'memoize(expensiveCalc)',
        output: 'Returns a wrapped function that caches results by argument signature',
      },
    ],
    constraints: ['Arguments are JSON-serializable primitives.', 'fn may be called with multiple arguments.'],
    starterCode: `function memoize(fn) {
  // your code here
}`,
    starterCodeTS: `function memoize<T extends (...args: any[]) => any>(fn: T): T {
  // your code here
}`,
    testCases: [
      {
        input: [null],
        expected: 'function',
        label: 'Returns a function',
      },
    ],
    solution: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
  },
  {
    id: '6',
    title: 'Parse Query String',
    slug: 'parse-query-string',
    difficulty: 'easy',
    description: `Implement \`parseQueryString(qs)\` that parses a URL query string into an object.

The input string may or may not start with \`?\`. Values that appear multiple times should be collected into an array.`,
    examples: [
      { input: '"?foo=1&bar=2&foo=3"', output: '{ foo: ["1", "3"], bar: "2" }' },
      { input: '"name=Alice&age=30"', output: '{ name: "Alice", age: "30" }' },
    ],
    constraints: ['Do not use URLSearchParams.', 'Values are always strings after parsing.'],
    starterCode: `function parseQueryString(qs) {
  // your code here
}`,
    starterCodeTS: `function parseQueryString(qs: string): Record<string, string | string[]> {
  // your code here
}`,
    testCases: [
      { input: ['?foo=1&bar=2&foo=3'], expected: { foo: ['1', '3'], bar: '2' }, label: 'Duplicate keys become array' },
      { input: ['name=Alice&age=30'], expected: { name: 'Alice', age: '30' }, label: 'No leading question mark' },
      { input: ['?single=value'], expected: { single: 'value' }, label: 'Single param' },
    ],
    solution: `function parseQueryString(qs) {
  const str = qs.startsWith('?') ? qs.slice(1) : qs;
  return str.split('&').reduce((acc, pair) => {
    const [key, val] = pair.split('=');
    if (!key) return acc;
    if (acc[key] !== undefined) {
      acc[key] = [].concat(acc[key], val);
    } else {
      acc[key] = val;
    }
    return acc;
  }, {});
}`,
  },
  {
    id: '7',
    title: 'Throttle Function',
    slug: 'throttle',
    difficulty: 'medium',
    description: `Implement \`throttle(fn, limit)\` that ensures \`fn\` is called at most once per \`limit\` milliseconds.

Unlike debounce, throttle executes immediately on the first call, then ignores subsequent calls until the limit window passes.`,
    examples: [
      {
        input: 'throttle(fn, 200)',
        output: 'fn fires immediately, then at most once every 200ms',
      },
    ],
    constraints: ['First call should execute immediately.', 'Calls within the limit period are ignored.'],
    starterCode: `function throttle(fn, limit) {
  // your code here
}`,
    starterCodeTS: `function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  // your code here
}`,
    testCases: [
      { input: [null, 100], expected: 'function', label: 'Returns a function' },
    ],
    solution: `function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}`,
  },
  {
    id: '8',
    title: 'Compose Functions',
    slug: 'compose',
    difficulty: 'medium',
    description: `Implement \`compose(...fns)\` that composes multiple functions right-to-left.

\`compose(f, g, h)(x)\` should equal \`f(g(h(x)))\`.`,
    examples: [
      {
        input: 'compose(x => x + 1, x => x * 2)(3)',
        output: '7',
        explanation: '3 * 2 = 6, then 6 + 1 = 7',
      },
    ],
    constraints: ['Each function takes a single argument.', 'Functions are applied right-to-left.'],
    starterCode: `function compose(...fns) {
  // your code here
}`,
    starterCodeTS: `function compose(...fns: Array<(x: any) => any>): (x: any) => any {
  // your code here
}`,
    testCases: [
      {
        input: ['__COMPOSE_TEST_1__'],
        expected: 7,
        label: 'add1(double(3)) = 7',
      },
      {
        input: ['__COMPOSE_TEST_2__'],
        expected: 'HELLO',
        label: 'toUpperCase(trim("  hello  ")) = "HELLO"',
      },
    ],
    solution: `function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}`,
  },
  {
    id: '9',
    title: 'Find Duplicates',
    slug: 'find-duplicates',
    difficulty: 'easy',
    description: `Given an array of numbers, return a sorted array of all values that appear more than once.

Each duplicate value should appear only once in the result.`,
    examples: [
      { input: '[1, 2, 3, 2, 4, 3, 5]', output: '[2, 3]' },
      { input: '[1, 1, 1, 2]', output: '[1]' },
    ],
    constraints: ['Result must be sorted ascending.', 'No duplicate values in the result array.'],
    starterCode: `function findDuplicates(arr) {
  // your code here
}`,
    starterCodeTS: `function findDuplicates(arr: number[]): number[] {
  // your code here
}`,
    testCases: [
      { input: [[1, 2, 3, 2, 4, 3, 5]], expected: [2, 3], label: 'Two duplicates' },
      { input: [[1, 1, 1, 2]], expected: [1], label: 'Triple occurrence' },
      { input: [[1, 2, 3]], expected: [], label: 'No duplicates' },
      { input: [[5, 5, 4, 4, 3, 3]], expected: [3, 4, 5], label: 'All duplicated' },
    ],
    solution: `function findDuplicates(arr) {
  const seen = new Set();
  const dupes = new Set();
  for (const n of arr) {
    if (seen.has(n)) dupes.add(n);
    else seen.add(n);
  }
  return [...dupes].sort((a, b) => a - b);
}`,
  },
  {
    id: '10',
    title: 'Chunk Array',
    slug: 'chunk-array',
    difficulty: 'easy',
    description: `Implement \`chunk(arr, size)\` that splits an array into chunks of the given size.

The last chunk may be smaller than \`size\` if the array length is not evenly divisible.`,
    examples: [
      { input: '[1, 2, 3, 4, 5], 2', output: '[[1, 2], [3, 4], [5]]' },
      { input: '[1, 2, 3], 3', output: '[[1, 2, 3]]' },
    ],
    constraints: ['size is a positive integer.', 'Return [] if arr is empty.'],
    starterCode: `function chunk(arr, size) {
  // your code here
}`,
    starterCodeTS: `function chunk<T>(arr: T[], size: number): T[][] {
  // your code here
}`,
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]], label: 'Uneven split' },
      { input: [[1, 2, 3], 3], expected: [[1, 2, 3]], label: 'Exact size' },
      { input: [[1, 2, 3, 4], 1], expected: [[1], [2], [3], [4]], label: 'Chunk size 1' },
      { input: [[], 2], expected: [], label: 'Empty array' },
    ],
    solution: `function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}`,
  },
]
