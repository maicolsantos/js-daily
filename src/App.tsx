import { useState, useCallback, useRef } from 'react'
import { TopBar } from './components/TopBar'
import { ProblemPanel } from './components/ProblemPanel'
import { EditorPanel } from './components/EditorPanel'
import { useChallenge } from './hooks/useChallenge'
import { useStorage } from './hooks/useStorage'

type Tab = 'problem' | 'solution' | 'discussion'

export default function App() {
  const challenge = useChallenge()
  const { data, loaded, saveCode, markSolved } = useStorage()
  const [activeTab, setActiveTab] = useState<Tab>('problem')
  const [justSolved, setJustSolved] = useState(false)
  const alreadySolvedOnLoad = useRef(false)

  if (!loaded || !challenge) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-muted text-sm">
        Loading…
      </div>
    )
  }

  const today = new Date().toDateString()
  const solvedToday = data.solvedIds.includes(challenge.id) && data.lastSolvedDate === today

  if (loaded && !alreadySolvedOnLoad.current && solvedToday && !justSolved) {
    alreadySolvedOnLoad.current = true
  }
  const showComeBack = alreadySolvedOnLoad.current && !justSolved && activeTab === 'problem'

  const handleCodeChange = (code: string) => saveCode(challenge.id, code)
  const handleSolved = async () => {
    await markSolved(challenge.id)
    setJustSolved(true)
  }

  return (
    <div className="flex flex-col h-screen bg-bg text-[#e6edf3] overflow-hidden">
      <TopBar
        streak={data.streak}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        solved={solvedToday || justSolved}
      />

      {showComeBack ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-semibold">Come back tomorrow!</h2>
          <p className="text-muted text-sm">You already solved today's challenge.</p>
          <div className="flex items-center gap-2 mt-2 text-sm bg-surface border border-border rounded-lg px-4 py-3">
            <span>🔥</span>
            <span className="text-white font-semibold">{data.streak}-day streak</span>
            <span className="text-muted">— keep it up!</span>
          </div>
          <button
            onClick={() => setActiveTab('solution')}
            className="mt-2 text-sm text-muted hover:text-white underline underline-offset-2 transition-colors"
          >
            Review the solution
          </button>
        </div>
      ) : (
        <main className="flex flex-1 min-h-0">
          <div className="w-[40%] border-r border-border overflow-hidden">
            <ProblemPanel challenge={challenge} activeTab={activeTab} />
          </div>
          <div className="w-[60%] overflow-hidden">
            {(
              <EditorPanel
                challenge={challenge}
                savedCode={data.code[challenge.id]}
                onCodeChange={handleCodeChange}
                onSolved={handleSolved}
                solved={solvedToday || justSolved}
                showSolution={false}
              />
            )}
          </div>
        </main>
      )}
    </div>
  )
}
