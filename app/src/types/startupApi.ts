export type EstagioStartup = 'IDEIA' | 'MVP' | 'SEED' | 'SERIES_A'

export interface StartupApiResponse {
  id: string
  nome: string
  descricao: string | null
  setor: string
  estagio: EstagioStartup
  captacaoObjetivo: number | null
  equityOferecida: number | null
  cidade: string | null
  estado: string | null
  website: string | null
  logoUrl: string | null
  createdAt: string
}

export interface StartupApiRequest {
  nome: string
  descricao?: string
  setor: string
  estagio: EstagioStartup
  captacaoObjetivo?: number | null
  equityOferecida?: number | null
  cidade?: string
  estado?: string
  website?: string
  logoUrl?: string
}

export interface StartupFilterParams {
  busca?: string
  setor?: string
  estagio?: EstagioStartup
  estado?: string
}

