import { currentInvestorProfile, currentStartupProfile } from '../data/mockData'
import type {
  InvestorSignupData,
  InvestorUserProfile,
  StartupStage,
  StartupUserProfile,
  UserProfile,
  UserRole,
} from '../types'

const STORAGE_KEY = 'nexo-user-profiles'
const REQUEST_DELAY = 450

type StoredProfiles = {
  startup: StartupUserProfile
  investor: InvestorUserProfile
}

const STARTUP_STAGE_FALLBACK: StartupStage = 'Seed'
const startupStages: StartupStage[] = ['Pré-semente', 'Seed', 'Série A', 'Expansion']

export type StartupSignupProfilePayload = {
  name: string
  email: string
  description: string
  stage: StartupStage
  sectors: string[]
  investmentMin: number
  investmentMax: number
}

export type InvestorSignupProfilePayload = Pick<
  InvestorSignupData,
  'name' | 'email' | 'investorType' | 'areas' | 'city'
> & {
  ticketMin: number
  ticketMax: number
}

function delay() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, REQUEST_DELAY)
  })
}

function getStorage() {
  if (typeof window === 'undefined') {
    throw new Error('O armazenamento local não está disponível neste ambiente.')
  }

  return window.localStorage
}

function cloneProfile<TProfile extends UserProfile>(profile: TProfile): TProfile {
  return structuredClone(profile)
}

function normalizeStartupStage(value: unknown): StartupStage {
  if (typeof value !== 'string') return STARTUP_STAGE_FALLBACK
  if (startupStages.includes(value as StartupStage)) return value as StartupStage

  if (value === 'Ideação' || value === 'MVP' || value === 'Pré-seed') return 'Pré-semente'
  if (value === 'Tração') return 'Série A'

  return STARTUP_STAGE_FALLBACK
}

function defaultProfiles(): StoredProfiles {
  return {
    startup: {
      id: currentStartupProfile.id,
      role: 'startup',
      name: currentStartupProfile.name,
      email: 'contato@novaflow.com',
      photoUrl: undefined,
      city: 'São Paulo',
      state: 'SP',
      linkedin: 'https://linkedin.com/company/novaflow',
      website: 'https://novaflow.example',
      instagram: '@novaflow',
      pitch: currentStartupProfile.description,
      stage: currentStartupProfile.stage,
      foundedYear: 2021,
      foundersCount: 3,
      teamSize: 18,
      investmentMin: currentStartupProfile.investmentMin,
      investmentMax: currentStartupProfile.investmentMax,
      tags: currentStartupProfile.sectors,
    },
    investor: {
      id: currentInvestorProfile.id,
      role: 'investor',
      name: currentInvestorProfile.name,
      email: 'helena@nexo.app',
      photoUrl: undefined,
      city: 'Belo Horizonte',
      state: 'MG',
      linkedin: 'https://linkedin.com/in/helenacosta',
      website: 'https://atlasventures.example',
      bio: currentInvestorProfile.description,
      investorType: currentInvestorProfile.investorType,
      interests: currentInvestorProfile.focus,
      ticketMin: currentInvestorProfile.ticketMin,
      ticketMax: currentInvestorProfile.ticketMax,
      portfolio: 'NovaFlow, VitaSol, GreenGrid',
    },
  }
}

function readProfiles(): StoredProfiles {
  const fallback = defaultProfiles()

  try {
    const raw = getStorage().getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as Partial<StoredProfiles>

    const startup: StartupUserProfile = { ...fallback.startup, ...parsed.startup, role: 'startup' }

    return {
      startup: { ...startup, stage: normalizeStartupStage(startup.stage) },
      investor: { ...fallback.investor, ...parsed.investor, role: 'investor' },
    }
  } catch {
    return fallback
  }
}

function writeProfiles(profiles: StoredProfiles) {
  getStorage().setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export async function fetchUserProfile(role: 'startup'): Promise<StartupUserProfile>
export async function fetchUserProfile(role: 'investor'): Promise<InvestorUserProfile>
export async function fetchUserProfile(role: UserRole): Promise<UserProfile>
export async function fetchUserProfile(role: UserRole): Promise<UserProfile> {
  await delay()
  const profiles = readProfiles()
  return cloneProfile(profiles[role])
}

export async function saveUserProfile(profile: StartupUserProfile): Promise<StartupUserProfile>
export async function saveUserProfile(profile: InvestorUserProfile): Promise<InvestorUserProfile>
export async function saveUserProfile(profile: UserProfile): Promise<UserProfile>
export async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  await delay()
  const profiles = readProfiles()
  const nextProfiles = { ...profiles, [profile.role]: profile }
  writeProfiles(nextProfiles)
  return cloneProfile(profile)
}

export function seedProfileFromSignup(role: 'startup', data: StartupSignupProfilePayload): void
export function seedProfileFromSignup(role: 'investor', data: InvestorSignupProfilePayload): void
export function seedProfileFromSignup(
  role: UserRole,
  data: StartupSignupProfilePayload | InvestorSignupProfilePayload,
) {
  const profiles = readProfiles()

  if (role === 'startup') {
    const startupData = data as StartupSignupProfilePayload
    writeProfiles({
      ...profiles,
      startup: {
        ...profiles.startup,
        name: startupData.name,
        email: startupData.email,
        pitch: startupData.description,
        stage: startupData.stage,
        tags: startupData.sectors,
        investmentMin: startupData.investmentMin,
        investmentMax: startupData.investmentMax,
      },
    })
    return
  }

  const investorData = data as InvestorSignupProfilePayload
  writeProfiles({
    ...profiles,
    investor: {
      ...profiles.investor,
      name: investorData.name,
      email: investorData.email,
      city: investorData.city,
      investorType: investorData.investorType,
      interests: investorData.areas,
      ticketMin: investorData.ticketMin,
      ticketMax: investorData.ticketMax,
    },
  })
}
