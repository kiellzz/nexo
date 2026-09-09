export type UserRole = 'startup' | 'investor' | 'admin'

export type StartupStage = 'Pré-semente' | 'Seed' | 'Série A' | 'Expansion'

export type ApprovalStatus = 'pending' | 'analyzing' | 'approved' | 'rejected'

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

export type MatchItem = {
  id: number
  name: string
  type: string
  match: number
  reasons: { label: string; value: number }[]
}

export type StartupFormData = {
  name: string
  sector: string
  city: string
  website: string
  description: string
  annualRevenue: string
  momGrowth: string
  customerCount: string
  monthlyCosts: string
  targetAmount: string
  equityOffered: string
  stage: StartupStage
  businessModel: string
}

export type ScenarioProjection = {
  pessimistic: number
  realistic: number
  optimistic: number
}

export type StartupAnalysis = {
  score: number
  healthScore: number
  growthScore: number
  riskScore: number
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  summary: string
  marketAssessment: string
  recommendation: 'approve' | 'review' | 'reject'
  projections: {
    months12: ScenarioProjection
    months24: ScenarioProjection
  }
  revenueProjection: {
    months12: ScenarioProjection
    months24: ScenarioProjection
  }
  valuationProjection: {
    months12: ScenarioProjection
    months24: ScenarioProjection
  }
}

export type PendingStartup = {
  id: string
  submittedAt: string
  status: ApprovalStatus
  rejectionReason?: string
  analysis?: StartupAnalysis
  formData: StartupFormData
}
