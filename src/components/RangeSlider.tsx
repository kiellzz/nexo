import { DollarSign } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  valueMin: number
  valueMax: number
  onChange: (min: number, max: number) => void
  label?: string
  hideLabel?: boolean
  prefix?: string
  formatValue?: (value: number) => string
  minLabel?: string
  maxLabel?: string
  readOnly?: boolean
}

export function RangeSlider({
  min,
  max,
  step = 10000,
  valueMin,
  valueMax,
  onChange,
  label,
  hideLabel = false,
  prefix = '',
  formatValue,
  minLabel = 'Min',
  maxLabel = 'Max',
  readOnly = false,
}: RangeSliderProps) {
  const [localMin, setLocalMin] = useState(valueMin)
  const [localMax, setLocalMax] = useState(valueMax)
  const [isDraggingMin, setIsDraggingMin] = useState(false)
  const [isDraggingMax, setIsDraggingMax] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const formatarValor = (val: number) => {
    if (formatValue) return formatValue(val)
    return prefix + new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Atualizar valores quando props mudam
  useEffect(() => {
    setLocalMin(valueMin)
    setLocalMax(valueMax)
  }, [valueMin, valueMax])

  const handleMouseDownMin = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingMin(true)
  }

  const handleMouseDownMax = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingMax(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const newValue = min + percentage * (max - min)
    const steppedValue = Math.round(newValue / step) * step

    if (isDraggingMin) {
      const newMin = Math.max(min, Math.min(steppedValue, localMax - step))
      setLocalMin(newMin)
      onChange(newMin, localMax)
    } else if (isDraggingMax) {
      const newMax = Math.min(max, Math.max(steppedValue, localMin + step))
      setLocalMax(newMax)
      onChange(localMin, newMax)
    }
  }

  const handleMouseUp = () => {
    setIsDraggingMin(false)
    setIsDraggingMax(false)
  }

  useEffect(() => {
    if (isDraggingMin || isDraggingMax) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingMin, isDraggingMax, localMin, localMax])

  const range = max - min || 1
  const minPercentage = ((localMin - min) / range) * 100
  const maxPercentage = ((localMax - min) / range) * 100

  return (
    <div
      className={`range-slider-container${readOnly ? ' range-slider-container--readonly' : ''}`}
      aria-readonly={readOnly || undefined}
    >
      {label && !hideLabel && <label className="range-slider-label">{label}</label>}
      
      <div className="range-slider-values">
        <div className="range-slider-value">
          <DollarSign size={16} aria-hidden="true" />
          <span>{minLabel}: {formatarValor(localMin)}</span>
        </div>
        <div className="range-slider-value">
          <DollarSign size={16} aria-hidden="true" />
          <span>{maxLabel}: {formatarValor(localMax)}</span>
        </div>
      </div>

      <div className="range-slider" ref={trackRef}>
        <div className="range-slider-track" />
        <div
          className="range-slider-fill"
          style={{
            left: `${minPercentage}%`,
            right: `${100 - maxPercentage}%`,
          }}
        />
        <div
          className={`range-slider-thumb range-slider-thumb-min ${isDraggingMin ? 'is-dragging' : ''}`}
          style={{ left: `${minPercentage}%` }}
          onMouseDown={readOnly ? undefined : handleMouseDownMin}
          role="slider"
          aria-label="Valor mínimo"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localMin}
          aria-readonly={readOnly || undefined}
          tabIndex={readOnly ? -1 : 0}
        />
        <div
          className={`range-slider-thumb range-slider-thumb-max ${isDraggingMax ? 'is-dragging' : ''}`}
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={readOnly ? undefined : handleMouseDownMax}
          role="slider"
          aria-label="Valor máximo"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localMax}
          aria-readonly={readOnly || undefined}
          tabIndex={readOnly ? -1 : 0}
        />
      </div>

      <div className="range-slider-labels">
        <span>{formatarValor(min)}</span>
        <span>{formatarValor(max)}</span>
      </div>
    </div>
  )
}
