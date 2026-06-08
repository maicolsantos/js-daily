import { TestResult } from '../types/challenge'

interface Props {
  results: TestResult[]
  running: boolean
}

function stringify(val: any): string {
  if (val === undefined) return 'undefined'
  try {
    return JSON.stringify(val)
  } catch {
    return String(val)
  }
}

export function TestResults({ results, running }: Props) {
  if (running) {
    return (
      <div className="flex items-center gap-2 p-4 text-muted text-sm">
        <span className="inline-block w-4 h-4 border-2 border-muted border-t-white rounded-full animate-spin" />
        Running tests…
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-muted text-sm">
        Click <span className="text-white font-medium">Run</span> to execute your code against the test cases.
      </div>
    )
  }

  const passed = results.filter((r) => r.passed).length
  const total = results.length
  const pct = Math.round((passed / total) * 100)

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-muted">
          {passed}/{total} tests passing
        </span>
        <span className={`text-sm font-semibold ${passed === total ? 'text-easy' : 'text-hard'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${passed === total ? 'bg-easy' : 'bg-hard'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="space-y-2 pt-1">
        {results.map((r, i) => (
          <div
            key={i}
            className={`rounded-lg border px-3 py-2 text-sm ${
              r.passed ? 'border-easy/30 bg-easy/5' : 'border-hard/30 bg-hard/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${r.passed ? 'bg-easy' : 'bg-hard'}`} />
              <span className={r.passed ? 'text-easy' : 'text-white'}>{r.label}</span>
            </div>
            {!r.passed && (
              <div className="mt-1.5 ml-4 font-mono text-xs space-y-0.5 text-muted">
                {r.error && (
                  <div>
                    <span className="text-hard">Error: </span>
                    <span>{r.error}</span>
                  </div>
                )}
                {!r.error && (
                  <>
                    <div>
                      <span className="text-muted">Expected: </span>
                      <span className="text-easy">{stringify(r.expected)}</span>
                    </div>
                    <div>
                      <span className="text-muted">Received: </span>
                      <span className="text-hard">{stringify(r.received)}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
