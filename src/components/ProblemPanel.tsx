import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Challenge, Difficulty } from '../types/challenge'

interface Props {
  challenge: Challenge
  activeTab?: 'problem' | 'solution' | 'discussion'
}

const difficultyColors: Record<Difficulty, string> = {
  easy: 'text-easy bg-easy/10',
  medium: 'text-medium bg-medium/10',
  hard: 'text-hard bg-hard/10',
}

function Md({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="text-sm text-muted leading-relaxed mb-2">{children}</p>,
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-')
          return isBlock
            ? <code className="block bg-bg border border-border rounded p-3 text-xs font-mono text-[#e6edf3] overflow-x-auto my-2 whitespace-pre">{children}</code>
            : <code className="bg-bg border border-border rounded px-1 py-0.5 text-xs font-mono text-[#e6edf3]">{children}</code>
        },
        pre: ({ children }) => <>{children}</>,
        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-sm text-muted">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-sm text-muted">{children}</ol>,
        li: ({ children }) => <li className="text-sm text-muted">{children}</li>,
        h1: ({ children }) => <h1 className="text-base font-semibold text-white mt-3 mb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-semibold text-white mt-3 mb-1">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-medium text-white mt-2 mb-1">{children}</h3>,
        a: ({ href, children }) => <a href={href} className="text-blue-400 underline" target="_blank" rel="noreferrer">{children}</a>,
        img: () => null,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export function ProblemPanel({ challenge, activeTab }: Props) {
  if (activeTab === 'solution') {
    return (
      <div className="h-full overflow-y-auto p-5 space-y-5 text-[#e6edf3]">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-lg font-semibold">{challenge.title}</h1>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${difficultyColors[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
        </div>
        {challenge.solution ? (
          <Md>{challenge.solution}</Md>
        ) : (
          <>
            <p className="text-sm text-muted">No solution available for this problem yet.</p>
            <div className="mt-4 border-t border-border pt-4">
              <Md>{challenge.description}</Md>
              {challenge.examples.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Examples</h2>
                  <div className="space-y-3">
                    {challenge.examples.map((ex, i) => (
                      <div key={i} className="bg-bg rounded-lg p-3 text-sm font-mono border border-border">
                        <div><span className="text-muted">Input: </span><span className="text-white">{ex.input}</span></div>
                        <div><span className="text-muted">Output: </span><span className="text-easy">{ex.output}</span></div>
                        {ex.explanation && <div className="mt-1 text-muted font-sans text-xs">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {challenge.constraints.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Constraints</h2>
                  <ul className="space-y-1">
                    {challenge.constraints.map((c, i) => (
                      <li key={i} className="text-sm text-muted flex gap-2">
                        <span className="text-border">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5 text-[#e6edf3]">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-lg font-semibold">{challenge.title}</h1>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${difficultyColors[challenge.difficulty]}`}
          >
            {challenge.difficulty}
          </span>
        </div>
        <Md>{challenge.description}</Md>
      </div>

      {challenge.examples.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Examples</h2>
          <div className="space-y-3">
            {challenge.examples.map((ex, i) => (
              <div key={i} className="bg-bg rounded-lg p-3 text-sm font-mono border border-border">
                <div>
                  <span className="text-muted">Input: </span>
                  <span className="text-white">{ex.input}</span>
                </div>
                <div>
                  <span className="text-muted">Output: </span>
                  <span className="text-easy">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="mt-1 text-muted font-sans text-xs">{ex.explanation}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {challenge.constraints.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Constraints</h2>
          <ul className="space-y-1">
            {challenge.constraints.map((c, i) => (
              <li key={i} className="text-sm text-muted flex gap-2">
                <span className="text-border">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
