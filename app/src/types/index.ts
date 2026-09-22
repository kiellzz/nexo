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
  avatar?: string
  banner?: string
  website?: string
  arr?: string
  mrr?: string
  founders?: string[]
  employeesCount?: number
  equityOffered?: string
  followersCount?: number
  connectionsCount?: number
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
  avatar?: string
  banner?: string
  portfolio?: string[]
  stages?: string[]
  followersCount?: number
  connectionsCount?: number
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

// ----------------------------------------------------
// REDE SOCIAL PROFISSIONAL NEXO (Tipos)
// ----------------------------------------------------

export type PostCategory = 'atualizacao' | 'conquista' | 'rodada' | 'tese' | 'geral'

export type PostComment = {
  id: string
  authorId: number
  authorName: string
  authorRole: UserRole
  authorAvatar: string
  content: string
  createdAt: string
}

export type SocialPost = {
  id: string
  authorId: number
  authorName: string
  authorRole: UserRole
  authorType: string // ex: "Logística SaaS" | "Investidor Anjo" | "Fundo de Venture Capital"
  authorAvatar: string
  authorBadge?: string // ex: "Startup Validada" | "Lead Investor"
  content: string
  category: PostCategory
  metricBadge?: {
    label: string
    value: string
    highlight?: boolean
  }
  opportunityDetails?: {
    targetAmount: string
    equityOffered: string
    stage: string
  }
  createdAt: string
  likesCount: number
  isLiked?: boolean
  isSaved?: boolean
  comments: PostComment[]
  sharesCount: number
}

export type NegotiationStatus =
  | 'interesse_enviado'
  | 'interesse_mutuo'
  | 'negociacao_iniciada'
  | 'proposta_enviada'
  | 'contraproposta'
  | 'em_analise'
  | 'acordo'
  | 'encerrada'

export type ProposalDetails = {
  id: string
  proposedBy: UserRole
  investmentAmount: number
  equityPercent: number
  valuation: number
  governanceTerms: string[]
  notes: string
  createdAt: string
  status: 'pendente' | 'aceita' | 'recusada' | 'contraproposta'
}

export type NegotiationMessage = {
  id: string
  senderRole: UserRole
  senderName: string
  content: string
  timestamp: string
  isSystemEvent?: boolean
}

export type Negotiation = {
  id: string
  startupId: number
  startupName: string
  startupSector: string
  startupAvatar: string
  investorId: number
  investorName: string
  investorType: string
  investorAvatar: string
  status: NegotiationStatus
  lastUpdated: string
  currentProposal: ProposalDetails
  proposalsHistory: ProposalDetails[]
  messages: NegotiationMessage[]
}

export type DirectMessage = {
  id: string
  senderId: number
  senderName: string
  senderRole: UserRole
  senderAvatar: string
  recipientId: number
  recipientName: string
  content: string
  timestamp: string
}

export type NotificationType =
  | 'match'
  | 'proposta'
  | 'contraproposta'
  | 'acordo'
  | 'interesse'
  | 'like'
  | 'comentario'
  | 'conexao'

export type NotificationItem = {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  read: boolean
  link: string
  actorName: string
  actorAvatar: string
}
