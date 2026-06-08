import { TestCase } from '../types/challenge'

export function buildRunnerScript(userCode: string, testCases: TestCase[]): string {
  const testsJson = JSON.stringify(testCases)
  const codeJson = JSON.stringify(userCode)

  return `
self.onerror = function(msg) {
  self.postMessage({ type: 'results', results: [{
    passed: false, label: 'Runtime error', input: [], expected: null,
    received: undefined, error: String(msg)
  }]});
  return true;
};

(function() {
  function send(results) {
    self.postMessage({ type: 'results', results: results });
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object') return a === b;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    var keysA = Object.keys(a);
    var keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (var i = 0; i < keysA.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(b, keysA[i])) return false;
      if (!deepEqual(a[keysA[i]], b[keysA[i]])) return false;
    }
    return true;
  }

  var testCases = ${testsJson};
  var userCode = ${codeJson};

  var userFn;
  try {
    var topLevelNames = [];
    var re1 = /^(?:var|let|const)\s+(\w+)\s*=\s*function/mg;
    var re2 = /^function\s+(\w+)/mg;
    var m;
    while ((m = re1.exec(userCode)) !== null) topLevelNames.push({ name: m[1], idx: m.index });
    while ((m = re2.exec(userCode)) !== null) topLevelNames.push({ name: m[1], idx: m.index });
    topLevelNames.sort(function(a, b) { return a.idx - b.idx; });
    console.log('[runner] topLevelNames:', JSON.stringify(topLevelNames));
    if (topLevelNames.length === 0) throw new Error('No named function found at top level.');
    var fnName = topLevelNames[0].name;
    console.log('[runner] fnName selected:', fnName);
    var wrapped = new Function(userCode + '\\nreturn typeof ' + fnName + ' !== "undefined" ? ' + fnName + ' : undefined;');
    userFn = wrapped();
    console.log('[runner] userFn type:', typeof userFn);
    if (typeof userFn !== 'function') throw new Error('Could not extract function "' + fnName + '"');
  } catch(e) {
    send(testCases.map(function(tc) {
      return { passed: false, label: tc.label, input: tc.input, expected: tc.expected, received: undefined, error: String(e.message) };
    }));
    return;
  }

  var results = [];
  for (var i = 0; i < testCases.length; i++) {
    var tc = testCases[i];
    try {
      var received;
      if (tc.input.length === 1 && tc.input[0] === '__COMPOSE_TEST_1__') {
        received = userFn(function(x) { return x + 1; }, function(x) { return x * 2; })(3);
      } else if (tc.input.length === 1 && tc.input[0] === '__COMPOSE_TEST_2__') {
        received = userFn(function(x) { return x.toUpperCase(); }, function(x) { return x.trim(); })('  hello  ');
      } else if (tc.expected === 'function') {
        received = typeof userFn(function(x){ return x; }, tc.input[1] !== undefined ? tc.input[1] : 100);
        results.push({ passed: received === 'function', label: tc.label, input: tc.input, expected: tc.expected, received: received });
        continue;
      } else {
        received = userFn.apply(null, tc.input);
      }
      results.push({ passed: deepEqual(received, tc.expected), label: tc.label, input: tc.input, expected: tc.expected, received: received });
    } catch(e) {
      results.push({ passed: false, label: tc.label, input: tc.input, expected: tc.expected, received: undefined, error: String(e.message) });
    }
  }
  send(results);
})();
`
}
