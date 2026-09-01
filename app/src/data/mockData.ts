import type { Investor, MatchItem, MatchReason, Opportunity, Startup } from '../types'
import {
  calculateMatchBreakdown,
  calculateMatchScore,
  type MatchBreakdown,
} from '../utils/matchScore'

type StartupSeed = Omit<Startup, 'match'>
type InvestorSeed = Omit<Investor, 'match'>

const startupSeeds: StartupSeed[] = [
  {
    id: 1,
    name: 'NovaFlow',
    sector: 'Logística IA',
    stage: 'Série A',
    sectors: ['Logística', 'IA', 'B2B'],
    city: 'São Paulo - SP',
    investment: 'R$ 1,2M - R$ 1,8M',
    investmentMin: 1_200_000,
    investmentMax: 1_800_000,
    description: 'Plataforma de otimização de frotas e rotas com inteligência artificial preditiva para grandes centros urbanos.',
    team: '18 pessoas',
    model: 'SaaS B2B',
    profileCompleteness: 0.92,
  },
  {
    id: 2,
    name: 'VitaSol',
    sector: 'Saúde Digital',
    stage: 'Pré-semente',
    sectors: ['Saúde', 'IA', 'B2B'],
    city: 'Rio de Janeiro - RJ',
    investment: 'R$ 300k - R$ 650k',
    investmentMin: 300_000,
    investmentMax: 650_000,
    description: 'Monitoramento remoto de pacientes crônicos e triagem inteligente para hospitais e planos de saúde.',
    team: '11 pessoas',
    model: 'B2B2C',
    profileCompleteness: 0.86,
  },
  {
    id: 3,
    name: 'GreenGrid',
    sector: 'Energia Limpa',
    stage: 'Seed',
    sectors: ['Sustentabilidade', 'Marketplace', 'B2B'],
    city: 'Belo Horizonte - MG',
    investment: 'R$ 700k - R$ 1,1M',
    investmentMin: 700_000,
    investmentMax: 1_100_000,
    description: 'Infraestrutura de gestão e eficiência energética automatizada para condomínios e indústrias sustentáveis.',
    team: '22 pessoas',
    model: 'Marketplace Energético',
    profileCompleteness: 0.9,
  },
]

const investorSeeds: InvestorSeed[] = [
  {
    id: 1,
    name: 'Helena Costa',
    type: 'Investidora Anjo',
    investorType: 'Anjo',
    focus: ['IA', 'Saúde', 'B2B'],
    city: 'Belo Horizonte - MG',
    ticket: 'R$ 300k - R$ 1,5M',
    ticketMin: 300_000,
    ticketMax: 1_500_000,
    thesis: 'Investimento em negócios digitais com alta tração, margens saudáveis e defensabilidade operacional comprovada.',
    description: 'Ex-fundadora de scale-up com foco em automação empresarial, inteligência artificial e plataformas de saúde.',
    profileCompleteness: 0.95,
  },
  {
    id: 2,
    name: 'Atlas Ventures',
    type: 'Venture Capital',
    investorType: 'Fundo',
    focus: ['Sustentabilidade', 'Energia', 'B2B'],
    city: 'São Paulo - SP',
    ticket: 'R$ 1M - R$ 3M',
    ticketMin: 1_000_000,
    ticketMax: 3_000_000,
    thesis: 'Foco em infraestrutura energética, transição de carbono e plataformas que otimizam o consumo de recursos vitais.',
    description: 'Fundo institucional de capital semente e Série A focado em sustentabilidade e impacto na América Latina.',
    profileCompleteness: 0.9,
  },
  {
    id: 3,
    name: 'North Capital',
    type: 'Venture Capital',
    investorType: 'Fundo',
    focus: ['Fintech', 'Logística', 'IA', 'Enterprise'],
    city: 'Curitiba - PR',
    ticket: 'R$ 1M - R$ 5M',
    ticketMin: 1_000_000,
    ticketMax: 5_000_000,
    thesis: 'Apoia scale-ups que digitalizam cadeias tradicionais através de software analítico e integração financeira.',
    description: 'Fundo com mais de 30 startups investidas no Brasil e forte rede de mentores estratégicos.',
    profileCompleteness: 0.88,
  },
]

export const currentStartupProfile: StartupSeed = startupSeeds[0]
export const currentInvestorProfile: InvestorSeed = investorSeeds[1]

export const startups: Startup[] = startupSeeds
  .map((startup) => ({
    ...startup,
    match: calculateMatchScore(currentInvestorProfile, startup),
  }))
  .sort((a, b) => b.match - a.match)

export const investors: Investor[] = investorSeeds
  .map((investor) => ({
    ...investor,
    match: calculateMatchScore(investor, currentStartupProfile),
  }))
  .sort((a, b) => b.match - a.match)

function toPercent(value: number) {
  return Math.round(value * 100)
}

function reasonsFromBreakdown(breakdown: MatchBreakdown): MatchReason[] {
  return [
    { label: 'Segmentos em comum', value: toPercent(breakdown.segmentos) },
    { label: 'Faixa de investimento', value: toPercent(breakdown.faixaInvestimento) },
    { label: 'Estágio & Investidor', value: toPercent(breakdown.afinidadeEstagio) },
    { label: 'Localização', value: toPercent(breakdown.localizacao) },
    { label: 'Completude do perfil', value: toPercent(breakdown.completude) },
  ]
}

const startupMatchCards: MatchItem[] = startups.map((startup) => ({
  id: startup.id,
  name: startup.name,
  type: 'startup',
  match: startup.match,
  reasons: reasonsFromBreakdown(calculateMatchBreakdown(currentInvestorProfile, startup)),
}))

const investorMatchCards: MatchItem[] = investors.map((investor) => ({
  id: investor.id + 100,
  name: investor.name,
  type: 'investor',
  match: investor.match,
  reasons: reasonsFromBreakdown(calculateMatchBreakdown(investor, currentStartupProfile)),
}))

export const matchCards: MatchItem[] = [...startupMatchCards, ...investorMatchCards]
  .sort((a, b) => b.match - a.match)
  .slice(0, 3)

export const opportunities: Opportunity[] = [
  {
    id: 1,
    name: 'Rodovias do Futuro (NovaFlow)',
    type: 'Rodada Aberta',
    sector: 'Logística & IA',
    description: 'Captação para acelerar expansão geográfica, contratação de talentos de engenharia e novos algoritmos de roteamento.',
    location: 'São Paulo - SP',
    value: 'R$ 1,8M',
    stage: 'Série A',
    match: calculateMatchScore(currentInvestorProfile, startupSeeds[0]),
    date: '12 mar',
    status: 'Ativa',
  },
  {
    id: 2,
    name: 'Acesso Saúde Conectada',
    type: 'Aceleração',
    sector: 'HealthTech',
    description: 'Programa de aceleração corporativa com validação clínica em rede de 40 hospitais parceiros.',
    location: 'Rio de Janeiro - RJ',
    value: 'R$ 600k',
    stage: 'Seed',
    match: calculateMatchScore(currentInvestorProfile, startupSeeds[1]),
    date: '18 mar',
    status: 'Nova',
  },
  {
    id: 3,
    name: 'Energia Solar Inteligente',
    type: 'Investimento Co-Lead',
    sector: 'CleanTech',
    description: 'Oportunidade de co-investimento para escala de hardware IoT e software de telemetria solar.',
    location: 'Belo Horizonte - MG',
    value: 'R$ 2,2M',
    stage: 'Série A',
    match: calculateMatchScore(currentInvestorProfile, startupSeeds[2]),
    date: '22 mar',
    status: 'Ativa',
  },
].sort((a, b) => b.match - a.match)

export const matches: MatchReason[] = reasonsFromBreakdown(
  calculateMatchBreakdown(currentInvestorProfile, currentStartupProfile),
)

export const navItems = [
  { label: 'Início', href: '/' },
  { label: 'Como funciona', href: '/operacao' },
  { label: 'Startups', href: '/buscar' },
  { label: 'Investidores', href: '/buscar' },
  { label: 'Oportunidades', href: '/oportunidades' },
]
