export type UserRole = 'startup' | 'investor'

export type Startup = {
  id: number
  name: string
  sector: string
  stage: string
  city: string
  match: number
  investment: string
  description: string
  team: string
  model: string
}

export type Investor = {
  id: number
  name: string
  type: string
  focus: string[]
  city: string
  match: number
  ticket: string
  thesis: string
  description: string
}

export type Opportunity = {
  id: number
  name: string
  type: string
  sector: string
  description: string
  location: string
  value: string
  stage: string
  match: number
  date: string
  status: string
}

export type MatchReason = {
  label: string
  value: number
}

export type MatchItem = {
  id: number
  name: string
  type: string
  match: number
  reasons: MatchReason[]
}

// ─── Signup form data ────────────────────────────────────────────────────────

export type StartupStage = 'Pré-semente' | 'Seed' | 'Série A' | 'Expansion'
export type InvestorType = 'Anjo' | 'Fundo' | 'Family Office'

export interface StartupSignupData {
  name: string
  email: string
  password: string
  confirmPassword: string
  description: string
  stage: StartupStage
  sectors: string[]
  /** Faixa de investimento como tupla numérica [min, max] em reais */
  investmentRange: [number, number]
  terms: boolean
}

export interface InvestorSignupData {
  name: string
  email: string
  password: string
  confirmPassword: string
  investorType: InvestorType
  areas: string[]
  /** Faixa de ticket como tupla numérica [min, max] em reais */
  ticketRange: [number, number]
  city: string
  terms: boolean
}