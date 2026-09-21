export const fasesStartup = ['Ideação', 'MVP', 'Tração', 'Escala'] as const

export const tiposInvestidor = ['Investidor-anjo', 'Fundo de VC', 'Family office', 'Corporativo'] as const

export type FaseStartup = (typeof fasesStartup)[number]
export type TipoInvestidorPerfil = (typeof tiposInvestidor)[number]
