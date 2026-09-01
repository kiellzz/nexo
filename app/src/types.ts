export type UserRole = 'startup' | 'investor'

export type Startup = {
  id: number
  name: string
  sector: string
  stage: StartupStage
  sectors: string[]
  city: string
  match: number
  investment: string
  investmentMin: number
  investmentMax: number
  description: string
  team: string
  model: string
  profileCompleteness?: number
}

export type Investor = {
  id: number
  name: string
  type: string
  investorType: InvestorType
  focus: string[]
  city: string
  match: number
  ticket: string
  ticketMin: number
  ticketMax: number
  thesis: string
  description: string
  profileCompleteness?: number
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

export interface BaseUserProfile {
  id: number
  role: UserRole
  name: string
  email: string
  photoUrl?: string
  city: string
  state: string
  linkedin?: string
  website?: string
}

export interface StartupUserProfile extends BaseUserProfile {
  role: 'startup'
  pitch: string
  stage: StartupStage
  foundedYear?: number
  foundersCount?: number
  teamSize?: number
  instagram?: string
  investmentMin: number
  investmentMax: number
  tags: string[]
}

export interface InvestorUserProfile extends BaseUserProfile {
  role: 'investor'
  bio: string
  investorType: InvestorType
  interests: string[]
  ticketMin: number
  ticketMax: number
  portfolio?: string
}

export type UserProfile = StartupUserProfile | InvestorUserProfile

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
