import { Challenge, Difficulty } from '../types/challenge'

interface Props {
  challenge: Challenge
}

const difficultyColors: Record<Difficulty, string> = {
  easy: 'text-easy bg-easy/10',
  medium: 'text-medium bg-medium/10',
  hard: 'text-hard bg-hard/10',
}

export function ProblemPanel({ challenge }: Props) {
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
        <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{challenge.description}</p>
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
