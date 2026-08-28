export function ProgressBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="match-row">
      <span className="match-label">{label}</span>
      <div className="progress-bar">
        <span style={{ width: `${value}%` }} />
      </div>
      <strong className="match-val">{value}%</strong>
    </div>
  )
}
