interface ReverseGeocodeResponse {
  city?: string
  town?: string
  village?: string
  state?: string
  state_code?: string
}

const estadosPorNome: Record<string, string> = {
  acre: 'AC', alagoas: 'AL', amapá: 'AP', amazonas: 'AM', bahia: 'BA', ceará: 'CE',
  'distrito federal': 'DF', 'espírito santo': 'ES', goiás: 'GO', maranhão: 'MA',
  'mato grosso': 'MT', 'mato grosso do sul': 'MS', 'minas gerais': 'MG', pará: 'PA',
  paraíba: 'PB', paraná: 'PR', pernambuco: 'PE', piauí: 'PI', 'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN', 'rio grande do sul': 'RS', rondônia: 'RO', roraima: 'RR',
  'santa catarina': 'SC', 'são paulo': 'SP', sergipe: 'SE', tocantins: 'TO',
}

interface LocalizacaoIdentificada {
  cidade: string | null
  estado: string | null
}

export async function buscarLocalizacaoPorCoordenadas(latitude: number, longitude: number): Promise<LocalizacaoIdentificada> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('zoom', '10')
  url.searchParams.set('accept-language', 'pt-BR')

  const response = await fetch(url)
  if (!response.ok) throw new Error('Não foi possível consultar a cidade.')

  const data = await response.json() as { address?: ReverseGeocodeResponse }
  const address = data.address
  const estadoCodigo = address?.state_code?.toUpperCase().replace('BR-', '')
  const estadoNome = address?.state?.trim().toLocaleLowerCase('pt-BR')

  return {
    cidade: address?.city ?? address?.town ?? address?.village ?? null,
    estado: estadoCodigo && /^[A-Z]{2}$/.test(estadoCodigo) ? estadoCodigo : estadosPorNome[estadoNome ?? ''] ?? null,
  }
}
