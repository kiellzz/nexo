import { z } from 'zod'
import type { InvestorType, StartupStage } from '../../types'

export const PROFILE_STARTUP_STAGES = [
  'Pré-semente',
  'Seed',
  'Série A',
  'Expansion',
] as const satisfies readonly StartupStage[]

export const INVESTOR_TYPES = [
  'Anjo',
  'Fundo',
  'Family Office',
] as const satisfies readonly InvestorType[]

const currentYear = new Date().getFullYear()
const optionalNumber = z.number().int().positive().optional()
const optionalYear = z.number().int().min(1900, 'Ano inválido').max(currentYear, 'Ano no futuro não parece certo').optional()
const optionalLink = z.string().trim().max(180, 'Use no máximo 180 caracteres').optional()

export const startupProfileSchema = z
  .object({
    role: z.literal('startup'),
    photoUrl: z.string().optional(),
    name: z.string().trim().min(2, 'Informe o nome da startup'),
    email: z.string().trim().email('E-mail inválido'),
    pitch: z
      .string()
      .trim()
      .min(20, 'Escreva um pitch com pelo menos 20 caracteres')
      .max(280, 'Use até 280 caracteres'),
    stage: z.enum(PROFILE_STARTUP_STAGES),
    foundedYear: optionalYear,
    foundersCount: optionalNumber,
    teamSize: optionalNumber,
    city: z.string().trim().min(2, 'Informe a cidade'),
    state: z.string().trim().min(2, 'Informe o estado').max(2, 'Use a sigla do estado'),
    website: optionalLink,
    linkedin: optionalLink,
    instagram: optionalLink,
    investmentMin: z.number().min(50_000),
    investmentMax: z.number().max(2_000_000),
    tags: z.array(z.string()).min(1, 'Selecione ao menos uma tag').max(8, 'Escolha até 8 tags'),
  })
  .refine((data) => data.investmentMin < data.investmentMax, {
    path: ['investmentMax'],
    message: 'O valor máximo deve ser maior que o mínimo',
  })

export const investorProfileSchema = z
  .object({
    role: z.literal('investor'),
    photoUrl: z.string().optional(),
    name: z.string().trim().min(2, 'Informe seu nome'),
    email: z.string().trim().email('E-mail inválido'),
    bio: z
      .string()
      .trim()
      .min(20, 'Escreva uma bio com pelo menos 20 caracteres')
      .max(320, 'Use até 320 caracteres'),
    investorType: z.enum(INVESTOR_TYPES),
    interests: z.array(z.string()).min(1, 'Selecione ao menos um setor').max(8, 'Escolha até 8 setores'),
    ticketMin: z.number().min(50_000),
    ticketMax: z.number().max(2_000_000),
    city: z.string().trim().min(2, 'Informe a cidade'),
    state: z.string().trim().min(2, 'Informe o estado').max(2, 'Use a sigla do estado'),
    linkedin: optionalLink,
    website: optionalLink,
    portfolio: z.string().trim().max(400, 'Use até 400 caracteres').optional(),
  })
  .refine((data) => data.ticketMin < data.ticketMax, {
    path: ['ticketMax'],
    message: 'O valor máximo deve ser maior que o mínimo',
  })

export type StartupProfileFormData = z.infer<typeof startupProfileSchema>
export type InvestorProfileFormData = z.infer<typeof investorProfileSchema>
