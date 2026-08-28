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