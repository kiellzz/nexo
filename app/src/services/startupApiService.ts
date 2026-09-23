import axios from 'axios'
import type {
  StartupApiRequest,
  StartupApiResponse,
  StartupFilterParams,
} from '../types/startupApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/startups'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
})

// Initial fallback mock data in case backend is offline
let fallbackStore: StartupApiResponse[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    nome: 'NovaFlow Logistics',
    descricao: 'Plataforma de otimização de rotas e frotas urbanas com inteligência artificial e análise preditiva.',
    setor: 'Logística',
    estagio: 'SERIES_A',
    captacaoObjetivo: 1500000,
    equityOferecida: 12.5,
    cidade: 'São Paulo',
    estado: 'SP',
    website: 'https://novaflow.com.br',
    logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    createdAt: '2026-09-20T10:15:00',
  },
  {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    nome: 'VitaSol Saúde Conectada',
    descricao: 'Telemetria clínica contínua e triagem inteligente para hospitais, clínicas e redes de atendimento.',
    setor: 'Saúde Digital',
    estagio: 'SEED',
    captacaoObjetivo: 850000,
    equityOferecida: 15.0,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    website: 'https://vitasol.med.br',
    logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80',
    createdAt: '2026-09-21T14:30:00',
  },
  {
    id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    nome: 'GreenGrid Energia',
    descricao: 'Gestão distribuída de microgeração solar e créditos de descarbonização em blockchain para condomínios.',
    setor: 'Energia Limpa',
    estagio: 'MVP',
    captacaoObjetivo: 600000,
    equityOferecida: 18.0,
    cidade: 'Belo Horizonte',
    estado: 'MG',
    website: 'https://greengrid.io',
    logoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=128&auto=format&fit=crop&q=80',
    createdAt: '2026-09-22T09:00:00',
  },
  {
    id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    nome: 'AgroSense Soluções',
    descricao: 'Monitoramento agronômico com satélites e sensores IoT para redução de defensivos agrícolas.',
    setor: 'AgriTech',
    estagio: 'IDEIA',
    captacaoObjetivo: 350000,
    equityOferecida: 20.0,
    cidade: 'Ribeirão Preto',
    estado: 'SP',
    website: 'https://agrosense.com.br',
    logoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=128&auto=format&fit=crop&q=80',
    createdAt: '2026-09-23T11:20:00',
  },
]

export const startupApiService = {
  async listStartups(params?: StartupFilterParams): Promise<{ data: StartupApiResponse[]; isMockFallback: boolean }> {
    try {
      const response = await apiClient.get<StartupApiResponse[]>('', { params })
      return { data: response.data, isMockFallback: false }
    } catch (err) {
      console.warn('Backend Spring Boot offline ou inacessível no momento. Utilizando dados locais.', err)
      let filtered = [...fallbackStore]
      if (params?.busca) {
        const q = params.busca.toLowerCase()
        filtered = filtered.filter(
          (s) => s.nome.toLowerCase().includes(q) || (s.descricao && s.descricao.toLowerCase().includes(q))
        )
      }
      if (params?.setor) {
        filtered = filtered.filter((s) => s.setor.toLowerCase().includes(params.setor!.toLowerCase()))
      }
      if (params?.estagio) {
        filtered = filtered.filter((s) => s.estagio === params.estagio)
      }
      if (params?.estado) {
        filtered = filtered.filter((s) => s.estado === params.estado)
      }
      return { data: filtered, isMockFallback: true }
    }
  },

  async getStartupById(id: string): Promise<{ data: StartupApiResponse; isMockFallback: boolean }> {
    try {
      const response = await apiClient.get<StartupApiResponse>(`/${id}`)
      return { data: response.data, isMockFallback: false }
    } catch (err) {
      console.warn(`Tentando recuperar startup ${id} localmente...`, err)
      const found = fallbackStore.find((s) => s.id === id)
      if (found) {
        return { data: found, isMockFallback: true }
      }
      throw new Error(`Startup com ID ${id} não encontrada.`)
    }
  },

  async createStartup(dto: StartupApiRequest): Promise<{ data: StartupApiResponse; isMockFallback: boolean }> {
    try {
      const response = await apiClient.post<StartupApiResponse>('', dto)
      return { data: response.data, isMockFallback: false }
    } catch (err) {
      console.warn('Backend Spring Boot offline. Salvando no armazenamento em memória local.', err)
      const newStartup: StartupApiResponse = {
        id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        nome: dto.nome,
        descricao: dto.descricao || null,
        setor: dto.setor,
        estagio: dto.estagio,
        captacaoObjetivo: dto.captacaoObjetivo ?? null,
        equityOferecida: dto.equityOferecida ?? null,
        cidade: dto.cidade || null,
        estado: dto.estado ? dto.estado.toUpperCase() : null,
        website: dto.website || null,
        logoUrl: dto.logoUrl || null,
        createdAt: new Date().toISOString(),
      }
      fallbackStore = [newStartup, ...fallbackStore]
      return { data: newStartup, isMockFallback: true }
    }
  },

  async updateStartup(id: string, dto: StartupApiRequest): Promise<{ data: StartupApiResponse; isMockFallback: boolean }> {
    try {
      const response = await apiClient.put<StartupApiResponse>(`/${id}`, dto)
      return { data: response.data, isMockFallback: false }
    } catch (err) {
      console.warn('Backend Spring Boot offline. Atualizando no armazenamento em memória local.', err)
      const index = fallbackStore.findIndex((s) => s.id === id)
      if (index === -1) {
        throw new Error(`Startup com ID ${id} não encontrada para atualização.`)
      }
      const updated: StartupApiResponse = {
        ...fallbackStore[index],
        nome: dto.nome,
        descricao: dto.descricao || null,
        setor: dto.setor,
        estagio: dto.estagio,
        captacaoObjetivo: dto.captacaoObjetivo ?? null,
        equityOferecida: dto.equityOferecida ?? null,
        cidade: dto.cidade || null,
        estado: dto.estado ? dto.estado.toUpperCase() : null,
        website: dto.website || null,
        logoUrl: dto.logoUrl || null,
      }
      fallbackStore[index] = updated
      return { data: updated, isMockFallback: true }
    }
  },

  async deleteStartup(id: string): Promise<{ isMockFallback: boolean }> {
    try {
      await apiClient.delete(`/${id}`)
      return { isMockFallback: false }
    } catch (err) {
      console.warn('Backend Spring Boot offline. Excluindo do armazenamento em memória local.', err)
      fallbackStore = fallbackStore.filter((s) => s.id !== id)
      return { isMockFallback: true }
    }
  },
}

