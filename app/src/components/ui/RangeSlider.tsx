import { useId } from 'react'

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatLabel?: (value: number) => string
}

const defaultFormat = (value: number) =>
  value >= 1_000_000
    ? `R$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
    : `R$${Math.round(value / 1000)}k`

export function RangeSlider({
  min,
  max,
  step = 10000,
  value,
  onChange,
  formatLabel = defaultFormat,
}: RangeSliderProps) {
  const id = useId()
  const [lo, hi] = value
  const range = max - min || 1

  function handleMinChange(next: number) {
    onChange([Math.max(min, Math.min(next, hi - step)), hi])
  }

  function handleMaxChange(next: number) {
    onChange([lo, Math.min(max, Math.max(next, lo + step))])
  }

  const loPercent = ((lo - min) / range) * 100
  const hiPercent = ((hi - min) / range) * 100
  const minZIndex = lo > max - step * 2 ? 5 : 3

  return (
    <div className="range-slider">
      <div className="range-slider-labels">
        <span className="range-slider-value-pill">
          <span>Mínimo</span>
          <strong>{formatLabel(lo)}</strong>
        </span>
        <span className="range-slider-value-pill">
          <span>Máximo</span>
          <strong>{formatLabel(hi)}</strong>
        </span>
      </div>

      <div className="range-slider-track-wrap">
        <div className="range-slider-track" />
        <div
          className="range-slider-track-fill"
          style={{ left: `${loPercent}%`, width: `${hiPercent - loPercent}%` }}
        />

        <input
          type="range"
          id={`${id}-min`}
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="range-slider-input range-slider-input-min"
          aria-label="Investimento mínimo"
          aria-valuetext={formatLabel(lo)}
          style={{ zIndex: minZIndex }}
        />
        <input
          type="range"
          id={`${id}-max`}
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="range-slider-input range-slider-input-max"
          aria-label="Investimento máximo"
          aria-valuetext={formatLabel(hi)}
        />
      </div>

      <div className="range-slider-scale" aria-hidden="true">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
    </div>
  )
}
