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

  function handleMinChange(next: number) {
    onChange([Math.min(next, hi - step), hi])
  }

  function handleMaxChange(next: number) {
    onChange([lo, Math.max(next, lo + step)])
  }

  const loPercent = ((lo - min) / (max - min)) * 100
  const hiPercent = ((hi - min) / (max - min)) * 100

  // NOVO: Se o valor mínimo estiver colado no máximo, ele vem para frente
  // para garantir que o usuário consiga puxá-lo de volta.
  const minZIndex = lo > max - step * 2 ? 5 : 3;

  return (
    <div className="range-slider">
      <div className="range-slider-labels">
        <span>{formatLabel(lo)}</span>
        <span>{formatLabel(hi)}</span>
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
          style={{ zIndex: minZIndex }} /* Aplicando o Z-index dinâmico */
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
          /* Z-index fixo em 4 (definido no CSS) */
        />
      </div>
    </div>
  )
}