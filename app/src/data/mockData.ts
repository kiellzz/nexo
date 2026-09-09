import type { Startup, Investor, Opportunity, MatchItem, PendingStartup, StartupAnalysis } from '../types'

export const startups: Startup[] = [
  {
    id: 1,
    name: 'NovaFlow',
    sector: 'Logística IA',
    stage: 'Série A',
    city: 'São Paulo - SP',
    match: 92,
    investment: 'R$ 1,2M',
    description: 'Plataforma de otimização de rotas com inteligência artificial para transporte urbano.',
    team: '18 pessoas',
    model: 'SaaS B2B',
  },
  {
    id: 2,
    name: 'VitaSol',
    sector: 'Saúde digital',
    stage: 'Pré-semente',
    city: 'Rio de Janeiro - RJ',
    match: 88,
    investment: 'R$ 450k',
    description: 'Monitoramento remoto de pacientes e triagem inteligente para clínicas e redes.',
    team: '11 pessoas',
    model: 'B2B2C',
  },
  {
    id: 3,
    name: 'GreenGrid',
    sector: 'Energia limpa',
    stage: 'Seed',
    city: 'Belo Horizonte - MG',
    match: 86,
    investment: 'R$ 780k',
    description: 'Infraestrutura de gestão energética para condomínios e pequenas redes industriais.',
    team: '22 pessoas',
    model: 'Marketplace energético',
  },
]

export const investors: Investor[] = [
  {
    id: 1,
    name: 'Helena Costa',
    type: 'Anjo',
    focus: ['IA', 'Saúde', 'B2B'],
    city: 'Belo Horizonte - MG',
    match: 91,
    ticket: 'R$ 300k - R$ 1M',
    thesis: 'Investimento em negócios com escalabilidade e defensabilidade operacional.',
    description: 'Investidora especialista em negócios de operação leve e forte potencial de automação.',
  },
  {
    id: 2,
    name: 'Atlas Ventures',
    type: 'Fundo',
    focus: ['Sustentabilidade', 'Energia', 'Clima'],
    city: 'São Paulo - SP',
    match: 89,
    ticket: 'R$ 2M - R$ 8M',
    thesis: 'Foco em energia, infraestrutura e plataformas que reduzem desperdício e melhoram eficiência.',
    description: 'Fundo de capital com foco em energia, infraestrutura e impactos ambientais.',
  },
  {
    id: 3,
    name: 'North Capital',
    type: 'Fundo',
    focus: ['Fintech', 'Logística', 'Enterprise'],
    city: 'Curitiba - PR',
    match: 84,
    ticket: 'R$ 1M - R$ 5M',
    thesis: 'Apoia empresas em fase de expansão com base em dados e eficiência operacional.',
    description: 'Fundo com foco em expansão e empresas de software e operação inteligente.',
  },
]

export const opportunities: Opportunity[] = [
  {
    id: 1,
    name: 'Rodovias do Futuro',
    type: 'Round',
    sector: 'Logística',
    description: 'Abertura de rodada para escala do produto em logística urbana e entregas inteligentes.',
    location: 'São Paulo - SP',
    value: 'R$ 1,8M',
    stage: 'Série A',
    match: 94,
    date: '12 mar',
    status: 'Ativa',
  },
  {
    id: 2,
    name: 'Acesso Saúde',
    type: 'Aceleração',
    sector: 'Saúde',
    description: 'Programa de aceleração para clínicas e plataformas de triagem digital.',
    location: 'Rio de Janeiro - RJ',
    value: 'R$ 600k',
    stage: 'Seed',
    match: 90,
    date: '18 mar',
    status: 'Nova',
  },
  {
    id: 3,
    name: 'Energia Inteligente',
    type: 'Investimento',
    sector: 'Energia',
    description: 'Oportunidade para crescimento de operação em gestão energética de prediais e fábricas.',
    location: 'Belo Horizonte - MG',
    value: 'R$ 2,2M',
    stage: 'Série A',
    match: 87,
    date: '22 mar',
    status: 'Ativa',
  },
]

export const matchCards: MatchItem[] = [
  {
    id: 1,
    name: 'NovaFlow',
    type: 'startup',
    match: 92,
    reasons: [
      { label: 'Segmento', value: 96 },
      { label: 'Localização', value: 88 },
      { label: 'Estágio', value: 91 },
    ],
  },
  {
    id: 2,
    name: 'VitaSol',
    type: 'startup',
    match: 90,
    reasons: [
      { label: 'Segmento', value: 94 },
      { label: 'Localização', value: 82 },
      { label: 'Estágio', value: 90 },
    ],
  },
  {
    id: 3,
    name: 'Helena Costa',
    type: 'investor',
    match: 91,
    reasons: [
      { label: 'Área', value: 96 },
      { label: 'Ticket', value: 86 },
      { label: 'Faixa', value: 89 },
    ],
  },
]

export const defaultMatches = [
  { label: 'Segmento', value: 96 },
  { label: 'Localização', value: 88 },
  { label: 'Estágio', value: 91 },
  { label: 'Ticket', value: 81 },
  { label: 'Mercado', value: 93 },
]

export const mockAnalysis: StartupAnalysis = {
  score: 78,
  healthScore: 72,
  growthScore: 85,
  riskScore: 38,
  strengths: [
    'Modelo de negócio SaaS com receita recorrente previsível',
    'Equipe técnica sênior com expertise em IA aplicada',
    'Mercado endereçável total (TAM) superior a R$ 4,5B',
    'Taxa de retenção de clientes acima de 90%',
  ],
  weaknesses: [
    'Concentração de receita em poucos clientes-âncora',
    'Dependência de infraestrutura de terceiros (cloud)',
    'Custo de aquisição de clientes (CAC) ainda elevado',
  ],
  opportunities: [
    'Expansão para mercados da América Latina com produto já validado',
    'Integração com sistemas ERP populares no mercado corporativo',
    'Crescente adoção de IA por empresas de médio porte',
  ],
  threats: [
    'Entrada de grandes players com recursos superiores',
    'Volatilidade regulatória no setor de logística e transporte',
    'Possível desaceleração econômica afetando investimentos em tecnologia',
  ],
  summary:
    'A startup apresenta fundamentos sólidos com um produto validado no mercado e crescimento consistente. O modelo SaaS B2B oferece previsibilidade de receita e alta escalabilidade. Os principais riscos estão relacionados à concentração de clientes e ao custo de expansão comercial. Com o aporte buscado, a empresa tem potencial para triplicar sua base de clientes em 24 meses.',
  marketAssessment:
    'O mercado de logística com IA está em plena expansão, impulsionado pela digitalização acelerada do supply chain pós-pandemia. A empresa opera em um nicho de alto valor com poucos competidores diretos no Brasil, o que representa uma janela estratégica de crescimento nos próximos 18-24 meses.',
  recommendation: 'approve',
  projections: {
    months12: { pessimistic: 15, realistic: 35, optimistic: 58 },
    months24: { pessimistic: 28, realistic: 78, optimistic: 142 },
  },
  revenueProjection: {
    months12: { pessimistic: 1380000, realistic: 1620000, optimistic: 1900000 },
    months24: { pessimistic: 1540000, realistic: 2150000, optimistic: 2900000 },
  },
  valuationProjection: {
    months12: { pessimistic: 5000000, realistic: 8000000, optimistic: 12000000 },
    months24: { pessimistic: 6500000, realistic: 14000000, optimistic: 24000000 },
  },
}

export const mockPendingStartups: PendingStartup[] = [
  {
    id: 'ps-001',
    submittedAt: '2026-09-07T10:30:00',
    status: 'pending',
    formData: {
      name: 'AgroTech Solutions',
      sector: 'AgriTech',
      city: 'Ribeirão Preto - SP',
      website: 'agrotech.com.br',
      description: 'Plataforma de monitoramento de lavouras com sensores IoT e análise preditiva.',
      annualRevenue: '480000',
      momGrowth: '12',
      customerCount: '38',
      monthlyCosts: '65000',
      targetAmount: '1200000',
      equityOffered: '15',
      stage: 'Seed',
      businessModel: 'SaaS B2B',
    },
  },
  {
    id: 'ps-002',
    submittedAt: '2026-09-08T14:15:00',
    status: 'analyzing',
    analysis: mockAnalysis,
    formData: {
      name: 'EduFlow',
      sector: 'EdTech',
      city: 'Curitiba - PR',
      website: 'eduflow.app',
      description: 'Plataforma adaptativa de ensino com IA para escolas públicas e privadas.',
      annualRevenue: '720000',
      momGrowth: '18',
      customerCount: '120',
      monthlyCosts: '85000',
      targetAmount: '2000000',
      equityOffered: '12',
      stage: 'Série A',
      businessModel: 'B2B2C',
    },
  },
]
