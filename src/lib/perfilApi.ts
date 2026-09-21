import { supabase } from './supabase'

export interface SegmentoOption {
  id: number
  nome: string
}

export interface StartupPerfilInput {
  usuarioId: string
  nomeResponsavel: string
  nomeStartup: string
  cnpj: string
  fase: string
  segmentoId: number
  descricao: string
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
}

export async function carregarSegmentos(): Promise<SegmentoOption[]> {
  const { data, error } = await supabase.from('segmento').select('id, nome').order('nome', { ascending: true })
  if (error) throw error
  return (data ?? []) as SegmentoOption[]
}

export async function salvarPerfilStartup(input: StartupPerfilInput): Promise<void> {
  const { error: startupError } = await supabase.from('startup').upsert({
    usuario_id: input.usuarioId,
    segmento_id: input.segmentoId,
    nome: input.nomeStartup,
    cnpj: input.cnpj,
    fase: input.fase,
    descricao: input.descricao,
  }, { onConflict: 'usuario_id' })
  if (startupError) throw startupError

  const { error: usuarioError } = await supabase
    .from('usuario')
    .update({ nome: input.nomeResponsavel })
    .eq('id', input.usuarioId)
  if (usuarioError) throw usuarioError
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
