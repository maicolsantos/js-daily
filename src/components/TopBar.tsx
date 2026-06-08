import { StreakBadge } from './StreakBadge'

type Tab = 'problem' | 'solution' | 'discussion'

interface Props {
  streak: number
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  solved: boolean
}

export function TopBar({ streak, activeTab, onTabChange, solved }: Props) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'problem', label: 'Problem' },
    { id: 'solution', label: 'Solution' },
    { id: 'discussion', label: 'Docs' },
  ]

  return (
    <header className="flex items-center justify-between px-5 h-12 border-b border-border bg-surface shrink-0">
      <div className="flex items-center gap-6">
        <span className="font-bold text-white text-base tracking-tight">
          JS<span className="text-yellow-400">Daily</span>
        </span>
        <nav className="flex items-center gap-1">
          {tabs.map((tab) =>
            tab.id === 'discussion' ? (
              <a
                key={tab.id}
                href="https://devdocs.io/javascript/"
                target="_self"
                className="px-3 py-1 rounded text-sm transition-colors text-muted hover:text-white"
              >
                {tab.label}
              </a>
            ) : (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                disabled={tab.id !== 'problem' && !solved}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : tab.id !== 'problem' && !solved
                    ? 'text-muted/40 cursor-not-allowed'
                    : 'text-muted hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            )
          )}
        </nav>
      </div>
      <StreakBadge streak={streak} />
    </header>
  )
}
