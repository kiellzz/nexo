import type {
  InvestorUserProfile,
  StartupUserProfile,
} from '../types'
import {
  calculateMatchBreakdown,
  calculateMatchScore,
  type MatchBreakdown,
  type MatchInvestor,
  type MatchStartup,
} from './matchScore'

function hasText(value?: string) {
  return Boolean(value?.trim())
}

function uniqueLabels(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function formatLocation(city: string, state: string) {
  const cleanCity = city.trim()
  const cleanState = state.trim().toUpperCase()

  if (!cleanCity) return cleanState
  if (!cleanState || cleanCity.includes('-')) return cleanCity

  return `${cleanCity} - ${cleanState}`
}

function scoreFilledFields(fields: boolean[]) {
  if (fields.length === 0) return 0
  return fields.filter(Boolean).length / fields.length
}

export function calculateStartupProfileCompleteness(profile: StartupUserProfile) {
  return scoreFilledFields([
    hasText(profile.photoUrl),
    hasText(profile.name),
    hasText(profile.email),
    hasText(profile.pitch),
    hasText(profile.stage),
    Boolean(profile.foundedYear),
    Boolean(profile.foundersCount),
    Boolean(profile.teamSize),
    hasText(profile.city),
    hasText(profile.state),
    hasText(profile.website),
    hasText(profile.linkedin),
    hasText(profile.instagram),
    profile.investmentMin > 0 && profile.investmentMax > profile.investmentMin,
    profile.tags.length > 0,
  ])
}

export function calculateInvestorProfileCompleteness(profile: InvestorUserProfile) {
  return scoreFilledFields([
    hasText(profile.photoUrl),
    hasText(profile.name),
    hasText(profile.email),
    hasText(profile.bio),
    hasText(profile.investorType),
    profile.interests.length > 0,
    profile.ticketMin > 0 && profile.ticketMax > profile.ticketMin,
    hasText(profile.city),
    hasText(profile.state),
    hasText(profile.linkedin),
    hasText(profile.website),
    hasText(profile.portfolio),
  ])
}

export function toMatchStartup(profile: StartupUserProfile): MatchStartup {
  return {
    stage: profile.stage,
    sectors: uniqueLabels(profile.tags),
    investmentMin: profile.investmentMin,
    investmentMax: profile.investmentMax,
    city: formatLocation(profile.city, profile.state),
    profileCompleteness: calculateStartupProfileCompleteness(profile),
  }
}

export function toMatchInvestor(profile: InvestorUserProfile): MatchInvestor {
  return {
    investorType: profile.investorType,
    areas: uniqueLabels(profile.interests),
    ticketMin: profile.ticketMin,
    ticketMax: profile.ticketMax,
    city: formatLocation(profile.city, profile.state),
    profileCompleteness: calculateInvestorProfileCompleteness(profile),
  }
}

export function calculateUserProfileMatchBreakdown(
  investor: InvestorUserProfile,
  startup: StartupUserProfile,
): MatchBreakdown {
  return calculateMatchBreakdown(toMatchInvestor(investor), toMatchStartup(startup))
}

export function calculateUserProfileMatchScore(
  investor: InvestorUserProfile,
  startup: StartupUserProfile,
) {
  return calculateMatchScore(toMatchInvestor(investor), toMatchStartup(startup))
}
