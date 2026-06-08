import { useCallback, useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Challenge, TestResult } from '../types/challenge'
import { TestResults } from './TestResults'
import { runCode } from '../lib/runner'

interface Props {
  challenge: Challenge
  savedCode: string | undefined
  onCodeChange: (code: string) => void
  onSolved: () => void
  solved: boolean
  showSolution: boolean
}

type Lang = 'javascript' | 'typescript'

export function EditorPanel({ challenge, savedCode, onCodeChange, onSolved, solved, showSolution }: Props) {
  const [lang, setLang] = useState<Lang>('javascript')
  const [results, setResults] = useState<TestResult[]>([])
  const [running, setRunning] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const defaultCode = lang === 'javascript' ? challenge.starterCode : challenge.starterCodeTS
  const [code, setCode] = useState<string>(savedCode ?? defaultCode)

  useEffect(() => {
    setCode(savedCode ?? defaultCode)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id])

  const handleChange = useCallback((val: string | undefined) => {
    const v = val ?? ''
    setCode(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onCodeChange(v), 500)
  }, [onCodeChange])

  const handleRun = useCallback(async () => {
    setRunning(true)
    setResults([])
    const res = await runCode(code, challenge.testCases)
    setResults(res)
    setRunning(false)
    if (res.length > 0 && res.every((r) => r.passed)) {
      onSolved()
    }
  }, [code, challenge.testCases, onSolved])

  const displayCode = showSolution ? challenge.solution : code

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface shrink-0">
        <div className="flex gap-1">
          {(['javascript', 'typescript'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                lang === l ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
              }`}
            >
              {l === 'javascript' ? 'JavaScript' : 'TypeScript'}
            </button>
          ))}
        </div>
        <button
          onClick={handleRun}
          disabled={running || showSolution}
          className="flex items-center gap-2 bg-easy/10 hover:bg-easy/20 text-easy border border-easy/30 rounded px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running && (
            <span className="inline-block w-3 h-3 border-2 border-easy/40 border-t-easy rounded-full animate-spin" />
          )}
          {running ? 'Running…' : 'Run'}
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={lang}
          value={displayCode}
          onChange={showSolution ? undefined : handleChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            lineNumbers: 'on',
            tabSize: 2,
            wordWrap: 'off',
            scrollBeyondLastLine: false,
            readOnly: showSolution,
            padding: { top: 12 },
          }}
        />
      </div>

      <div className="border-t border-border bg-surface max-h-64 overflow-y-auto shrink-0">
        {solved && !showSolution && results.length === 0 ? (
          <div className="p-4 text-sm text-easy">✓ Already solved today!</div>
        ) : (
          <TestResults results={results} running={running} />
        )}
      </div>
    </div>
  )
}
