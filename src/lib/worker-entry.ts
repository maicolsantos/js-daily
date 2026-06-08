import { buildRunnerScript } from './testRunner'

self.onmessage = (e: MessageEvent) => {
  if (!e.data || e.data.type !== 'run') return
  const { userCode, testCases } = e.data

  // buildRunnerScript returns code that calls self.postMessage — eval it here
  const script = buildRunnerScript(userCode, testCases)
  try {
    // eslint-disable-next-line no-eval
    eval(script)
  } catch (err: any) {
    self.postMessage({
      type: 'results',
      results: testCases.map((tc: any) => ({
        passed: false,
        label: tc.label,
        input: tc.input,
        expected: tc.expected,
        received: undefined,
        error: String(err?.message ?? err),
      })),
    })
  }
}
