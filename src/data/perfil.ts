export const fasesStartup = ['Ideação', 'MVP', 'Tração', 'Escala'] as const

export const tiposInvestidor = ['Investidor-anjo', 'Fundo de VC', 'Family office', 'Corporativo'] as const
export const estadosBrasil = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] as const

export type FaseStartup = (typeof fasesStartup)[number]
export type TipoInvestidorPerfil = (typeof tiposInvestidor)[number]
