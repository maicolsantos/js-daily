interface Props {
  streak: number
}

export function StreakBadge({ streak }: Props) {
  return (
    <div className="flex items-center gap-1.5 bg-surface border border-border rounded-full px-3 py-1 text-sm">
      <span>🔥</span>
      <span className="font-semibold text-white">{streak}</span>
      <span className="text-muted">{streak === 1 ? 'day' : 'days'}</span>
    </div>
  )
}
