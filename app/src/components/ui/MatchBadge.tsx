export function MatchBadge({
  value,
  label = 'Match',
}: {
  value: number
  label?: string
}) {
  return (
    <span className="match-badge">
      <span className="badge-dot" />
      {value}% {label}
    </span>
  )
}
