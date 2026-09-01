import type { InvestorType, StartupStage } from '../types'

type RangeTuple = [number, number]

export type MatchInvestor = {
  investorType: InvestorType
  areas?: string[]
  focus?: string[]
  ticketRange?: RangeTuple
  ticketMin?: number
  ticketMax?: number
  city?: string
  profileCompleteness?: number
}

export type MatchStartup = {
  stage: StartupStage
  sectors?: string[]
  investmentRange?: RangeTuple
  investmentMin?: number
  investmentMax?: number
  city?: string
  profileCompleteness?: number
}

export type MatchBreakdown = {
  segmentos: number
  faixaInvestimento: number
  afinidadeEstagio: number
  localizacao: number
  completude: number
}

export const affinityTable: Record<InvestorType, Record<StartupStage, number>> = {
  Anjo: {
    'Pré-semente': 0.95,
    Seed: 0.82,
    'Série A': 0.52,
    Expansion: 0.3,
  },
  Fundo: {
    'Pré-semente': 0.35,
    Seed: 0.78,
    'Série A': 0.95,
    Expansion: 0.82,
  },
  'Family Office': {
    'Pré-semente': 0.42,
    Seed: 0.68,
    'Série A': 0.84,
    Expansion: 0.92,
  },
}

function normalizeLabel(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function normalizeCompleteness(value?: number) {
  if (value === undefined) return 0.8
  return value > 1 ? clamp01(value / 100) : clamp01(value)
}

function getInvestorSegments(investor: MatchInvestor) {
  return investor.areas ?? investor.focus ?? []
}

function getInvestorRange(investor: MatchInvestor): RangeTuple {
  if (investor.ticketRange) return investor.ticketRange
  return [investor.ticketMin ?? 0, investor.ticketMax ?? 0]
}

function getStartupRange(startup: MatchStartup): RangeTuple {
  if (startup.investmentRange) return startup.investmentRange
  return [startup.investmentMin ?? 0, startup.investmentMax ?? 0]
}

export function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map(normalizeLabel).filter(Boolean))
  const setB = new Set(b.map(normalizeLabel).filter(Boolean))

  if (setA.size === 0 && setB.size === 0) return 1
  if (setA.size === 0 || setB.size === 0) return 0

  const intersection = [...setA].filter((item) => setB.has(item)).length
  const union = new Set([...setA, ...setB]).size

  return intersection / union
}

export function overlapRange(min1: number, max1: number, min2: number, max2: number): number {
  const low1 = Math.min(min1, max1)
  const high1 = Math.max(min1, max1)
  const low2 = Math.min(min2, max2)
  const high2 = Math.max(min2, max2)

  if (high1 <= low1 || high2 <= low2) return 0

  const overlap = Math.max(0, Math.min(high1, high2) - Math.max(low1, low2))
  const smallerRange = Math.min(high1 - low1, high2 - low2)

  return smallerRange === 0 ? 0 : overlap / smallerRange
}

export function calculateMatchBreakdown(
  investor: MatchInvestor,
  startup: MatchStartup,
): MatchBreakdown {
  const [ticketMin, ticketMax] = getInvestorRange(investor)
  const [investmentMin, investmentMax] = getStartupRange(startup)
  const investorCity = investor.city ? normalizeLabel(investor.city) : ''
  const startupCity = startup.city ? normalizeLabel(startup.city) : ''
  const sameLocation = investorCity !== '' && startupCity !== '' && investorCity === startupCity
  const sameState =
    investorCity !== '' &&
    startupCity !== '' &&
    investorCity.split('-').at(-1)?.trim() === startupCity.split('-').at(-1)?.trim()

  return {
    segmentos: jaccardSimilarity(getInvestorSegments(investor), startup.sectors ?? []),
    faixaInvestimento: overlapRange(ticketMin, ticketMax, investmentMin, investmentMax),
    afinidadeEstagio: affinityTable[investor.investorType]?.[startup.stage] ?? 0,
    localizacao: sameLocation ? 1 : sameState ? 0.65 : 0.25,
    completude: (normalizeCompleteness(investor.profileCompleteness) + normalizeCompleteness(startup.profileCompleteness)) / 2,
  }
}

export function calculateMatchScore(investor: MatchInvestor, startup: MatchStartup): number {
  const breakdown = calculateMatchBreakdown(investor, startup)
  const score =
    0.35 * breakdown.segmentos +
    0.25 * breakdown.faixaInvestimento +
    0.25 * breakdown.afinidadeEstagio +
    0.1 * breakdown.localizacao +
    0.05 * breakdown.completude

  return Math.round(clamp01(score) * 100)
}
