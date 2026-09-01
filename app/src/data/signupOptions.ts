/**
 * Opções pré-definidas para os campos de multi-select e faixas de investimento
 * do formulário de cadastro. Importe este arquivo sempre que precisar dessas listas.
 */

export const SECTOR_TAGS: string[] = [
  'IA',
  'Saúde',
  'B2B',
  'Fintech',
  'Logística',
  'Educação',
  'Sustentabilidade',
  'E-commerce',
  'Marketplace',
  'AgriTech',
  'Construção',
  'Entretenimento',
]

// ─── RangeSlider ──────────────────────────────────────────────────────────────

/** Valor mínimo do slider de investimento (R$50k) */
export const SLIDER_MIN = 50_000

/** Valor máximo do slider de investimento (R$2M) */
export const SLIDER_MAX = 2_000_000

/** Passo de cada incremento (R$50k) */
export const SLIDER_STEP = 50_000

/** Marcos visuais exibidos abaixo do trilho */
export const SLIDER_MARKERS: number[] = [
  50_000,
  100_000,
  300_000,
  500_000,
  1_000_000,
  2_000_000,
]

/**
 * Formata um valor numérico de investimento para exibição amigável.
 * Ex: 100000 → "R$100k" | 1000000 → "R$1M" | 2000000 → "R$2M+"
 */
export function formatInvestment(v: number): string {
  if (v >= 2_000_000) return 'R$2M+'
  if (v >= 1_000_000) return `R$${v / 1_000_000}M`
  if (v >= 1_000)     return `R$${v / 1_000}k`
  return `R$${v}`
}

// ─── Legado (mantido para compatibilidade) ────────────────────────────────────

export interface InvestmentRange {
  label: string
  value: string
}

/** @deprecated Use RangeSlider + SLIDER_* em vez dos selects */
export const INVESTMENT_RANGES: InvestmentRange[] = [
  { label: 'R$ 50k',  value: '50k' },
  { label: 'R$ 100k', value: '100k' },
  { label: 'R$ 300k', value: '300k' },
  { label: 'R$ 500k', value: '500k' },
  { label: 'R$ 1M',   value: '1M' },
  { label: 'R$ 1M+',  value: '1M+' },
]
