import type { Investor, MatchItem, MatchReason, Opportunity, Startup } from '../types'

export const startups: Startup[] = [
  {
    id: 1,
    name: 'NovaFlow',
    sector: 'Logística IA',
    stage: 'Série A',
    city: 'São Paulo - SP',
    match: 94,
    investment: 'R$ 1,2M',
    description: 'Plataforma de otimização de frotas e rotas com inteligência artificial preditiva para grandes centros urbanos.',
    team: '18 pessoas',
    model: 'SaaS B2B',
  },
  {
    id: 2,
    name: 'VitaSol',
    sector: 'Saúde Digital',
    stage: 'Pré-semente',
    city: 'Rio de Janeiro - RJ',
    match: 89,
    investment: 'R$ 450k',
    description: 'Monitoramento remoto de pacientes crônicos e triagem inteligente para hospitais e planos de saúde.',
    team: '11 pessoas',
    model: 'B2B2C',
  },
  {
    id: 3,
    name: 'GreenGrid',
    sector: 'Energia Limpa',
    stage: 'Seed',
    city: 'Belo Horizonte - MG',
    match: 88,
    investment: 'R$ 780k',
    description: 'Infraestrutura de gestão e eficiência energética automatizada para condomínios e indústrias sustentáveis.',
    team: '22 pessoas',
    model: 'Marketplace Energético',
  },
]

export const investors: Investor[] = [
  {
    id: 1,
    name: 'Helena Costa',
    type: 'Investidora Anjo',
    focus: ['IA', 'Saúde', 'B2B SaaS'],
    city: 'Belo Horizonte - MG',
    match: 96,
    ticket: 'R$ 300k - R$ 1M',
    thesis: 'Investimento em negócios digitais com alta tração, margens saudáveis e defensabilidade operacional comprovada.',
    description: 'Ex-fundadora de scale-up com foco em automação empresarial, inteligência artificial e plataformas de saúde.',
  },
  {
    id: 2,
    name: 'Atlas Ventures',
    type: 'Venture Capital',
    focus: ['Sustentabilidade', 'Energia', 'ClimateTech'],
    city: 'São Paulo - SP',
    match: 91,
    ticket: 'R$ 2M - R$ 8M',
    thesis: 'Foco em infraestrutura energética, transição de carbono e plataformas que otimizam o consumo de recursos vitais.',
    description: 'Fundo institucional de capital semente e Série A focado em sustentabilidade e impacto na América Latina.',
  },
  {
    id: 3,
    name: 'North Capital',
    type: 'Venture Capital',
    focus: ['Fintech', 'Logística', 'Enterprise'],
    city: 'Curitiba - PR',
    match: 86,
    ticket: 'R$ 1M - R$ 5M',
    thesis: 'Apoia scale-ups que digitalizam cadeias tradicionais através de software analítico e integração financeira.',
    description: 'Fundo com mais de 30 startups investidas no Brasil e forte rede de mentores estratégicos.',
  },
]

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
    match: 95,
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
    match: 91,
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
    match: 89,
    date: '22 mar',
    status: 'Ativa',
  },
]

export const matchCards: MatchItem[] = [
  {
    id: 1,
    name: 'NovaFlow',
    type: 'startup',
    match: 94,
    reasons: [
      { label: 'Segmento & Tese', value: 98 },
      { label: 'Momento de Tração', value: 92 },
      { label: 'Faixa de Ticket', value: 94 },
    ],
  },
  {
    id: 2,
    name: 'VitaSol',
    type: 'startup',
    match: 90,
    reasons: [
      { label: 'Fit Setorial', value: 95 },
      { label: 'Equipe & Governança', value: 88 },
      { label: 'Estágio de Maturidade', value: 91 },
    ],
  },
  {
    id: 3,
    name: 'Helena Costa',
    type: 'investor',
    match: 96,
    reasons: [
      { label: 'Alinhamento de Tese', value: 99 },
      { label: 'Disponibilidade de Capital', value: 95 },
      { label: 'Sinergia de Mentoria', value: 94 },
    ],
  },
]

export const matches: MatchReason[] = [
  { label: 'Segmento & Tese', value: 96 },
  { label: 'Estágio & Maturidade', value: 92 },
  { label: 'Faixa de Ticket', value: 89 },
  { label: 'Localização & Expansão', value: 94 },
  { label: 'Potencial de Mercado', value: 95 },
]

export const navItems = [
  { label: 'Início', href: '/' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Startups', href: '/buscar' },
  { label: 'Investidores', href: '/buscar' },
  { label: 'Oportunidades', href: '/oportunidades' },
]
