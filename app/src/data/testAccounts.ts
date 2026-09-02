import type { InvestorType, StartupStage, UserRole } from '../types'

const TEST_ACCOUNT_PASSWORD = 'NexoTeste123'

export type StartupTestSignupData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  description: string
  stage: StartupStage
  sectors: string[]
  investmentMin: number
  investmentMax: number
  terms: boolean
}

export type InvestorTestSignupData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  investorType: InvestorType
  areas: string[]
  ticketMin: number
  ticketMax: number
  city: string
  terms: boolean
}

export const TEST_SIGNUP_DATA: {
  startup: StartupTestSignupData
  investor: InvestorTestSignupData
} = {
  startup: {
    name: 'Nexo',
    email: 'teste.startup@nexo.app',
    password: TEST_ACCOUNT_PASSWORD,
    confirmPassword: TEST_ACCOUNT_PASSWORD,
    description:
      'A Nexo conecta startups promissoras a investidores estratégicos por meio de dados, fit de mercado e oportunidades qualificadas.',
    stage: 'Seed',
    sectors: ['IA', 'B2B', 'Fintech'],
    investmentMin: 100_000,
    investmentMax: 500_000,
    terms: true,
  },
  investor: {
    name: 'Investidor Secreto',
    email: 'teste.investidor@nexo.app',
    password: TEST_ACCOUNT_PASSWORD,
    confirmPassword: TEST_ACCOUNT_PASSWORD,
    investorType: 'Anjo',
    areas: ['IA', 'B2B', 'Fintech'],
    ticketMin: 100_000,
    ticketMax: 500_000,
    city: 'São Paulo',
    terms: true,
  },
}

export const TEST_LOGIN_DATA: Record<UserRole, { email: string; password: string }> = {
  startup: {
    email: TEST_SIGNUP_DATA.startup.email,
    password: TEST_SIGNUP_DATA.startup.password,
  },
  investor: {
    email: TEST_SIGNUP_DATA.investor.email,
    password: TEST_SIGNUP_DATA.investor.password,
  },
}
