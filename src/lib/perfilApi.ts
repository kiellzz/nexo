import { supabase } from './supabase'

export interface SegmentoOption {
  id: number
  nome: string
}

export interface RodadaDisponivelData {
  id: number
  startupId: number
  valorAlvo: number
  valorCaptado: number
  percentualEquityOferecido: number
  status: string
  dataInicio: string
  startup: {
    id: number
    nomeStartup: string
    fase: string
    segmentoId: number
    segmentoNome: string
    descricao: string
    dataFundacao: string | null
    siteUrl: string | null
    cidade: string | null
    estado: string | null
    videoPitchUrl: string | null
    linkedinUrl: string | null
    segmentosSecundarios: string[]
  }
}

export interface StartupPerfilInput {
  usuarioId: string
  nomeResponsavel: string
  nomeStartup: string
  cnpj: string
  fase: string
  segmentoId: number
  descricao: string
  videoPitchUrl?: string | null
  dataFundacao?: string | null
  siteUrl?: string | null
  localizacao?: string | null
  cidade?: string | null
  estado?: string | null
  latitude?: number | null
  longitude?: number | null
  segmentosSecundarios: number[]
  linkedinUrl?: string | null
  rodada: StartupRodadaInput
}

export interface StartupRodadaInput {
  valorAlvo: number
  valorCaptado: number
  percentualEquityOferecido: number
  status: string
}

export interface InvestidorPerfilInput {
  usuarioId: string
  nome: string
  cpf: string
  tipo: string
  biografia: string
  ticketMin: number
  ticketMax: number
  segmentos: number[]
  linkedinUrl?: string | null
}

export async function carregarSegmentos(): Promise<SegmentoOption[]> {
  const { data, error } = await supabase.from('segmento').select('id, nome').order('nome', { ascending: true })
  if (error) throw error
  return (data ?? []) as SegmentoOption[]
}

export async function carregarRodadasAbertas(): Promise<RodadaDisponivelData[]> {
  const [{ data: captacoes, error: captacoesError }, { data: startups, error: startupsError }, segmentos, { data: relacionamentos, error: relacionamentosError }] = await Promise.all([
    supabase.from('captacao').select('id, startup_id, valor_alvo, valor_captado, percentual_equity_oferecido, status, data_inicio').eq('status', 'aberta'),
    supabase.from('startup').select('id, nome, fase, segmento_id, descricao, data_fundacao, site_url, cidade, estado, video_pitch_url, linkedin_url'),
    carregarSegmentos(),
    supabase.from('startup_segmento').select('startup_id, segmento_id'),
  ])
  if (captacoesError) throw captacoesError
  if (startupsError) throw startupsError
  if (relacionamentosError) throw relacionamentosError

  const startupsById = new Map((startups ?? []).map((startup) => [startup.id, startup]))
  const segmentosById = new Map(segmentos.map((segmento) => [segmento.id, segmento.nome]))
  const secundariosByStartup = new Map<number, string[]>()
  ;(relacionamentos ?? []).forEach((relacionamento) => {
    const nomes = secundariosByStartup.get(relacionamento.startup_id) ?? []
    const nome = segmentosById.get(relacionamento.segmento_id)
    if (nome) secundariosByStartup.set(relacionamento.startup_id, [...nomes, nome])
  })

  return (captacoes ?? []).flatMap((captacao) => {
    const startup = startupsById.get(captacao.startup_id)
    if (!startup) return []
    return [{
      id: captacao.id,
      startupId: captacao.startup_id,
      valorAlvo: captacao.valor_alvo,
      valorCaptado: captacao.valor_captado,
      percentualEquityOferecido: captacao.percentual_equity_oferecido,
      status: captacao.status,
      dataInicio: captacao.data_inicio,
      startup: {
        id: startup.id,
        nomeStartup: startup.nome,
        fase: startup.fase,
        segmentoId: startup.segmento_id,
        segmentoNome: segmentosById.get(startup.segmento_id) ?? 'Segmento não informado',
        descricao: startup.descricao,
        dataFundacao: startup.data_fundacao ?? null,
        siteUrl: startup.site_url ?? null,
        cidade: startup.cidade ?? null,
        estado: startup.estado ?? null,
        videoPitchUrl: startup.video_pitch_url ?? null,
        linkedinUrl: startup.linkedin_url ?? null,
        segmentosSecundarios: secundariosByStartup.get(startup.id) ?? [],
      },
    }]
  })
}

export async function salvarPerfilStartup(input: StartupPerfilInput): Promise<void> {
  const { data: startup, error: startupError } = await supabase.from('startup').upsert({
    usuario_id: input.usuarioId,
    segmento_id: input.segmentoId,
    nome: input.nomeStartup,
    cnpj: input.cnpj,
    fase: input.fase,
    descricao: input.descricao,
    ...(input.videoPitchUrl !== undefined ? { video_pitch_url: input.videoPitchUrl } : {}),
    ...(input.dataFundacao !== undefined ? { data_fundacao: input.dataFundacao } : {}),
    ...(input.siteUrl !== undefined ? { site_url: input.siteUrl } : {}),
    ...(input.localizacao !== undefined ? { localizacao: input.localizacao } : {}),
    ...(input.cidade !== undefined ? { cidade: input.cidade } : {}),
    ...(input.estado !== undefined ? { estado: input.estado } : {}),
    ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
    ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
    ...(input.linkedinUrl !== undefined ? { linkedin_url: input.linkedinUrl } : {}),
  }, { onConflict: 'usuario_id' }).select('id').single()
  if (startupError) throw startupError

  const { data: captacao, error: captacaoQueryError } = await supabase
    .from('captacao')
    .select('id')
    .eq('startup_id', startup.id)
    .maybeSingle()
  if (captacaoQueryError) throw captacaoQueryError

  const rodadaPayload = {
    startup_id: startup.id,
    valor_alvo: input.rodada.valorAlvo,
    valor_captado: input.rodada.valorCaptado,
    percentual_equity_oferecido: input.rodada.percentualEquityOferecido,
    status: input.rodada.status,
    data_inicio: new Date().toISOString().slice(0, 10),
  }

  if (captacao) {
    const { error } = await supabase.from('captacao').update(rodadaPayload).eq('id', captacao.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('captacao').insert(rodadaPayload)
    if (error) throw error
  }

  const { error: usuarioError } = await supabase
    .from('usuario')
    .update({ nome: input.nomeResponsavel })
    .eq('id', input.usuarioId)
  if (usuarioError) throw usuarioError

  const { error: deleteSegmentosError } = await supabase
    .from('startup_segmento')
    .delete()
    .eq('startup_id', startup.id)
  if (deleteSegmentosError) throw deleteSegmentosError

  if (input.segmentosSecundarios.length > 0) {
    const { error: segmentosError } = await supabase
      .from('startup_segmento')
      .insert(input.segmentosSecundarios.map((segmentoId) => ({ startup_id: startup.id, segmento_id: segmentoId })))
    if (segmentosError) throw segmentosError
  }
}

export async function salvarPerfilInvestidor(input: InvestidorPerfilInput): Promise<void> {
  const { data: investidor, error: investidorError } = await supabase
    .from('investidor')
    .upsert({
      usuario_id: input.usuarioId,
      nome: input.nome,
      cpf: input.cpf,
      tipo: input.tipo,
      biografia: input.biografia,
      ticket_min: input.ticketMin,
      ticket_max: input.ticketMax,
      ...(input.linkedinUrl !== undefined ? { linkedin_url: input.linkedinUrl } : {}),
    }, { onConflict: 'usuario_id' })
    .select('id')
    .single()
  if (investidorError) throw investidorError

  const investidorId = (investidor as { id: number }).id

  const { error: deleteError } = await supabase
    .from('investidor_segmento')
    .delete()
    .eq('investidor_id', investidorId)
  if (deleteError) throw deleteError

  const { error: segmentosError } = await supabase
    .from('investidor_segmento')
    .insert(input.segmentos.map((segmentoId) => ({ investidor_id: investidorId, segmento_id: segmentoId })))
  if (segmentosError) throw segmentosError

  const { error: usuarioError } = await supabase
    .from('usuario')
    .update({ nome: input.nome })
    .eq('id', input.usuarioId)
  if (usuarioError) throw usuarioError
}

export interface StartupPerfilData {
  nomeResponsavel: string
  nomeStartup: string
  cnpj: string
  fase: string
  segmentoId: number
  descricao: string
  videoPitchUrl: string | null
  dataFundacao: string | null
  siteUrl: string | null
  localizacao: string | null
  cidade: string | null
  estado: string | null
  latitude: number | null
  longitude: number | null
  segmentosSecundarios: number[]
  linkedinUrl: string | null
  rodada: StartupRodadaData | null
}

export interface StartupRodadaData {
  valorAlvo: number
  valorCaptado: number
  percentualEquityOferecido: number
  status: string
}

export interface InvestidorPerfilData {
  nome: string
  cpf: string
  tipo: string
  biografia: string
  ticketMin: number
  ticketMax: number
  segmentos: number[]
  linkedinUrl: string | null
}

export async function carregarPerfilStartup(usuarioId: string): Promise<StartupPerfilData | null> {
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuario')
    .select('nome')
    .eq('id', usuarioId)
    .single()
  if (usuarioError) throw usuarioError

  const { data: startup, error: startupError } = await supabase
    .from('startup')
    .select('*')
    .eq('usuario_id', usuarioId)
    .single()
  if (startupError) {
    if (startupError.code === 'PGRST116') return null // No rows returned
    throw startupError
  }

  const { data: captacao, error: captacaoError } = await supabase
    .from('captacao')
    .select('valor_alvo, valor_captado, percentual_equity_oferecido, status, data_inicio')
    .eq('startup_id', startup.id)
    .maybeSingle()
  if (captacaoError) throw captacaoError

  const { data: segmentosSecundarios, error: segmentosSecundariosError } = await supabase
    .from('startup_segmento')
    .select('segmento_id')
    .eq('startup_id', startup.id)
  if (segmentosSecundariosError) throw segmentosSecundariosError

  return {
    nomeResponsavel: usuario.nome,
    nomeStartup: startup.nome,
    cnpj: startup.cnpj,
    fase: startup.fase,
    segmentoId: startup.segmento_id,
    descricao: startup.descricao,
    videoPitchUrl: startup.video_pitch_url ?? null,
    dataFundacao: startup.data_fundacao ?? null,
    siteUrl: startup.site_url ?? null,
    localizacao: startup.localizacao ?? null,
    cidade: startup.cidade ?? null,
    estado: startup.estado ?? null,
    latitude: startup.latitude ?? null,
    longitude: startup.longitude ?? null,
    segmentosSecundarios: segmentosSecundarios?.map((item) => item.segmento_id) ?? [],
    linkedinUrl: startup.linkedin_url ?? null,
    rodada: captacao
      ? {
          valorAlvo: captacao.valor_alvo,
          valorCaptado: captacao.valor_captado,
          percentualEquityOferecido: captacao.percentual_equity_oferecido,
          status: captacao.status,
        }
      : null,
  }
}

export async function carregarPerfilInvestidor(usuarioId: string): Promise<InvestidorPerfilData | null> {
  const { data: investidor, error: investidorError } = await supabase
    .from('investidor')
    .select('*')
    .eq('usuario_id', usuarioId)
    .single()
  if (investidorError) {
    if (investidorError.code === 'PGRST116') return null // No rows returned
    throw investidorError
  }

  const { data: segmentosData, error: segmentosError } = await supabase
    .from('investidor_segmento')
    .select('segmento_id')
    .eq('investidor_id', investidor.id)
  if (segmentosError) throw segmentosError

  return {
    nome: investidor.nome,
    cpf: investidor.cpf,
    tipo: investidor.tipo,
    biografia: investidor.biografia,
    ticketMin: investidor.ticket_min,
    ticketMax: investidor.ticket_max,
    segmentos: segmentosData?.map((s) => s.segmento_id) ?? [],
    linkedinUrl: investidor.linkedin_url ?? null,
  }
}
