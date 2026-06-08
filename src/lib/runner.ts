import { TestCase, TestResult } from '../types/challenge'
import { buildRunnerScript } from './testRunner'

const TIMEOUT_MS = 5000

export function runCode(userCode: string, testCases: TestCase[]): Promise<TestResult[]> {
  return new Promise((resolve) => {
    const script = buildRunnerScript(userCode, testCases)
    const blob = new Blob([script], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    URL.revokeObjectURL(url)

    let settled = false

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      worker.terminate()
      resolve(
        testCases.map((tc) => ({
          passed: false,
          label: tc.label,
          input: tc.input,
          expected: tc.expected,
          received: undefined,
          error: 'Execution timed out',
        }))
      )
    }, TIMEOUT_MS)

    worker.onmessage = (e) => {
      if (!e.data || e.data.type !== 'results') return
      if (settled) return
      settled = true
      clearTimeout(timer)
      worker.terminate()
      resolve(e.data.results as TestResult[])
    }

    worker.onerror = (e) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      worker.terminate()
      resolve(
        testCases.map((tc) => ({
          passed: false,
          label: tc.label,
          input: tc.input,
          expected: tc.expected,
          received: undefined,
          error: e.message,
        }))
      )
    }
  })
}
