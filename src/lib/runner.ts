import { TestCase, TestResult } from '../types/challenge'

const TIMEOUT_MS = 5000

function getSandboxUrl(): string {
  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
    return chrome.runtime.getURL('sandbox.html')
  }
  return './sandbox.html'
}

export function runCode(userCode: string, testCases: TestCase[]): Promise<TestResult[]> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    let settled = false

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
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

    function cleanup() {
      clearTimeout(timer)
      window.removeEventListener('message', onMessage)
      iframe.remove()
    }

    function onMessage(e: MessageEvent) {
      if (e.source !== iframe.contentWindow) return
      if (!e.data || e.data.type !== 'results') return
      if (settled) return
      settled = true
      cleanup()
      resolve(e.data.results as TestResult[])
    }

    window.addEventListener('message', onMessage)

    iframe.onload = () => {
      iframe.contentWindow!.postMessage({ type: 'run', userCode, testCases }, '*')
    }

    iframe.src = getSandboxUrl()
  })
}
