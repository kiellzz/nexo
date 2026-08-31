import { Pill } from './Pill'

interface TagSelectorProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

/**
 * Multi-select de chips/tags. Reutiliza o componente Pill para os chips selecionados.
 * Cada tag é clicável para togglear a seleção.
 */
export function TagSelector({ options, value, onChange, error }: TagSelectorProps) {
  function toggle(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag))
    } else {
      onChange([...value, tag])
    }
  }

  return (
    <div>
      <div className="tag-selector">
        {options.map((tag) => {
          const selected = value.includes(tag)
          return selected ? (
            <Pill
              key={tag}
              className="tag-chip selected"
              onClick={() => toggle(tag)}
            >
              {tag} ✕
            </Pill>
          ) : (
            <button
              key={tag}
              type="button"
              className="tag-chip"
              onClick={() => toggle(tag)}
            >
              {tag}
            </button>
          )
        })}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
