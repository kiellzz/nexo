import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: '.env' })

// Configuração do Supabase
const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas.')
  console.error('📝 Certifique-se de definir VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env')
  console.error('Ou passe como argumentos: SUPABASE_URL="sua-url" SUPABASE_ANON_KEY="sua-key" npm run seed')
  process.exit(1)
}

console.log('🔗 Conectando ao Supabase...')
const supabase = createClient(url, anonKey)

// IDs de usuários existentes (simulados - em produção você usaria IDs reais)
const startupUserIds = [
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440010',
]

const investidorUserIds = [
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440015',
]

// Dados de startups
const startupsData = [
  {
    usuarioId: startupUserIds[0],
    nomeResponsavel: 'Ana Silva',
    nomeStartup: 'PayFlow',
    cnpj: '12345678000190',
    fase: 'MVP',
    segmentoId: 1, // Fintech
    descricao: 'Plataforma de pagamentos B2B para pequenas empresas com automação de conciliação bancária e integração com ERP.',
  },
  {
    usuarioId: startupUserIds[1],
    nomeResponsavel: 'Carlos Mendes',
    nomeStartup: 'HealthConnect',
    cnpj: '23456789000191',
    fase: 'Tração',
    segmentoId: 2, // Healthtech
    descricao: 'Sistema de telemedicina que conecta pacientes a especialistas com IA para triagem inicial e agendamento automático.',
  },
  {
    usuarioId: startupUserIds[2],
    nomeResponsavel: 'Marina Costa',
    nomeStartup: 'EduSmart',
    cnpj: '34567890000192',
    fase: 'MVP',
    segmentoId: 3, // Edtech
    descricao: 'Plataforma de aprendizado adaptativo com IA personalizada para ensino fundamental e médio em escolas públicas.',
  },
  {
    usuarioId: startupUserIds[3],
    nomeResponsavel: 'Pedro Santos',
    nomeStartup: 'AgroTech Solutions',
    cnpj: '45678901000193',
    fase: 'Escala',
    segmentoId: 4, // Agritech
    descricao: 'Sistema de monitoramento de safras com IoT e análise de dados para otimização de produção agrícola.',
  },
  {
    usuarioId: startupUserIds[4],
    nomeResponsavel: 'Julia Oliveira',
    nomeStartup: 'LogiTrack',
    cnpj: '56789012000194',
    fase: 'Tração',
    segmentoId: 5, // Logtech
    descricao: 'Plataforma de gestão logística com roteirização inteligente e rastreamento em tempo real de frotas.',
  },
  {
    usuarioId: startupUserIds[5],
    nomeResponsavel: 'Ricardo Lima',
    nomeStartup: 'EcoEnergy',
    cnpj: '67890123000195',
    fase: 'MVP',
    segmentoId: 6, // Greentech
    descricao: 'Solução de energia solar residencial com monitoramento inteligente e integração à rede elétrica.',
  },
  {
    usuarioId: startupUserIds[6],
    nomeResponsavel: 'Fernanda Alves',
    nomeStartup: 'FoodDelivery Pro',
    cnpj: '78901234000196',
    fase: 'Escala',
    segmentoId: 7, // Foodtech
    descricao: 'Plataforma de delivery focada em restaurantes locais com sistema de gestão integrado e analytics.',
  },
  {
    usuarioId: startupUserIds[7],
    nomeResponsavel: 'Lucas Pereira',
    nomeStartup: 'RetailAI',
    cnpj: '89012345000197',
    fase: 'Tração',
    segmentoId: 8, // Retailtech
    descricao: 'Sistema de inteligência de varejo com análise de comportamento do consumidor e gestão de estoque preditiva.',
  },
  {
    usuarioId: startupUserIds[8],
    nomeResponsavel: 'Camila Rodrigues',
    nomeStartup: 'GovPlatform',
    cnpj: '90123456000198',
    fase: 'Ideação',
    segmentoId: 9, // Govtech
    descricao: 'Plataforma de transparência pública e participação cidadã com gestão de processos governamentais.',
  },
  {
    usuarioId: startupUserIds[9],
    nomeResponsavel: 'André Ferreira',
    nomeStartup: 'CloudManage',
    cnpj: '01234567000199',
    fase: 'Escala',
    segmentoId: 10, // SaaS B2B
    descricao: 'Ferramenta de gestão de infraestrutura cloud com otimização de custos e automação de deployments.',
  },
]

// Dados de investidores
const investidoresData = [
  {
    usuarioId: investidorUserIds[0],
    nome: 'Roberto Campos',
    cpf: '12345678901',
    tipo: 'Investidor-anjo',
    biografia: 'Empreendedor serial com 15 anos de experiência em tecnologia. Foco em early-stage startups com potencial de disruptão.',
    ticketMin: 50000,
    ticketMax: 200000,
    segmentos: [1, 3, 10], // Fintech, Edtech, SaaS B2B
  },
  {
    usuarioId: investidorUserIds[1],
    nome: 'Venture Capital SP',
    cpf: '98765432101',
    tipo: 'Fundo de VC',
    biografia: 'Fundo de venture capital focado em tecnologias B2B com ticket entre R$500k e R$2M. Portfolio de 20 empresas.',
    ticketMin: 500000,
    ticketMax: 2000000,
    segmentos: [1, 5, 8, 10], // Fintech, Logtech, Retailtech, SaaS B2B
  },
  {
    usuarioId: investidorUserIds[2],
    nome: 'Family Office Oliveira',
    cpf: '45678912301',
    tipo: 'Family office',
    biografia: 'Family office com foco em investimentos de impacto e tecnologia sustentável. Horizonte de longo prazo.',
    ticketMin: 300000,
    ticketMax: 1500000,
    segmentos: [4, 6, 7], // Agritech, Greentech, Foodtech
  },
  {
    usuarioId: investidorUserIds[3],
    nome: 'Corp Innovation Ltda',
    cpf: '78912345601',
    tipo: 'Corporativo',
    biografia: 'Braço de inovação de grande grupo industrial, busca startups para parcerias estratégicas e investimentos.',
    ticketMin: 1000000,
    ticketMax: 5000000,
    segmentos: [2, 4, 6, 9], // Healthtech, Agritech, Greentech, Govtech
  },
  {
    usuarioId: investidorUserIds[4],
    nome: 'Angel Investor Tech',
    cpf: '32165498701',
    tipo: 'Investidor-anjo',
    biografia: 'Ex-CTO de unicórnio brasileiro, investe em deep tech e hardtech. Mentoria ativa para founders.',
    ticketMin: 100000,
    ticketMax: 500000,
    segmentos: [3, 6, 10], // Edtech, Greentech, SaaS B2B
  },
]

// Dados de rodadas de captação
const captacoesData = [
  {
    startupNome: 'PayFlow',
    valorAlvo: 300000,
    valorCaptado: 120000,
    percentualEquityOferecido: 10,
    status: 'aberta',
    dataInicio: '2026-09-01',
  },
  {
    startupNome: 'HealthConnect',
    valorAlvo: 800000,
    valorCaptado: 450000,
    percentualEquityOferecido: 15,
    status: 'aberta',
    dataInicio: '2026-08-15',
  },
  {
    startupNome: 'EduSmart',
    valorAlvo: 250000,
    valorCaptado: 50000,
    percentualEquityOferecido: 12,
    status: 'aberta',
    dataInicio: '2026-09-10',
  },
  {
    startupNome: 'AgroTech Solutions',
    valorAlvo: 2000000,
    valorCaptado: 1500000,
    percentualEquityOferecido: 8,
    status: 'aberta',
    dataInicio: '2026-07-01',
  },
  {
    startupNome: 'LogiTrack',
    valorAlvo: 600000,
    valorCaptado: 200000,
    percentualEquityOferecido: 10,
    status: 'aberta',
    dataInicio: '2026-08-20',
  },
]

async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...')

  try {
    // 1. Limpar dados existentes (opcional - cuidado em produção!)
    console.log('⚠️  Limpeza de dados existentes...')
    await supabase.from('investidor_segmento').delete().neq('investidor_id', 0)
    await supabase.from('investidor').delete().neq('id', 0)
    await supabase.from('startup').delete().neq('id', 0)
    await supabase.from('captacao').delete().neq('id', 0)
    await supabase.from('usuario').delete().neq('id', 0)

    // 2. Criar usuários para startups
    console.log('👤 Criando usuários de startups...')
    for (let i = 0; i < startupsData.length; i++) {
      const startup = startupsData[i]
      const { error } = await supabase.from('usuario').insert({
        id: startup.usuarioId,
        nome: startup.nomeResponsavel,
        tipo: 'startup',
        ativo: true,
      })

      if (error) {
        console.error(`Erro ao criar usuario startup${i + 1}:`, error)
      }
    }

    // 3. Criar startups
    console.log('🚀 Criando startups...')
    for (const startup of startupsData) {
      const { error } = await supabase.from('startup').insert({
        usuario_id: startup.usuarioId,
        segmento_id: startup.segmentoId,
        nome: startup.nomeStartup,
        cnpj: startup.cnpj,
        fase: startup.fase,
        descricao: startup.descricao,
      })

      if (error) {
        console.error(`Erro ao criar startup ${startup.nomeStartup}:`, error)
      }
    }

    // 4. Criar usuários para investidores
    console.log('💼 Criando usuários de investidores...')
    for (let i = 0; i < investidoresData.length; i++) {
      const investidor = investidoresData[i]
      const { error } = await supabase.from('usuario').insert({
        id: investidor.usuarioId,
        nome: investidor.nome,
        tipo: 'investidor',
        ativo: true,
      })

      if (error) {
        console.error(`Erro ao criar usuario investidor${i + 1}:`, error)
      }
    }

    // 5. Criar investidores
    console.log('📈 Criando investidores...')
    const investidorIds = []
    for (const investidor of investidoresData) {
      const { data: investidorData, error: investidorError } = await supabase
        .from('investidor')
        .insert({
          usuario_id: investidor.usuarioId,
          nome: investidor.nome,
          cpf: investidor.cpf,
          tipo: investidor.tipo,
          biografia: investidor.biografia,
          ticket_min: investidor.ticketMin,
          ticket_max: investidor.ticketMax,
        })
        .select('id')
        .single()

      if (investidorError) {
        console.error(`Erro ao criar investidor ${investidor.nome}:`, investidorError)
        continue
      }

      investidorIds.push((investidorData as { id: number }).id)
    }

    // 6. Criar relações investidor_segmento
    console.log('🔗 Criando relações investidor-segmento...')
    for (let i = 0; i < investidoresData.length; i++) {
      const investidor = investidoresData[i]
      const investidorId = investidorIds[i]
      
      for (const segmentoId of investidor.segmentos) {
        await supabase.from('investidor_segmento').insert({
          investidor_id: investidorId,
          segmento_id: segmentoId,
        })
      }
    }

    // 7. Criar rodadas de captação
    console.log('💰 Criando rodadas de captação...')
    // Primeiro, precisamos obter os IDs das startups criadas
    const { data: startupsCriadas } = await supabase
      .from('startup')
      .select('id, nome')
      .order('id')

    if (startupsCriadas) {
      for (const captacao of captacoesData) {
        const startup = startupsCriadas.find((s) => s.nome === captacao.startupNome)
        if (startup) {
          const { error } = await supabase.from('captacao').insert({
            startup_id: startup.id,
            valor_alvo: captacao.valorAlvo,
            valor_captado: captacao.valorCaptado,
            percentual_equity_oferecido: captacao.percentualEquityOferecido,
            status: captacao.status,
            data_inicio: captacao.dataInicio,
          })

          if (error) {
            console.error(`Erro ao criar captação para ${startup.nome}:`, error)
          }
        }
      }
    }

    console.log('✅ Seed concluído com sucesso!')
    console.log('\n📊 Resumo:')
    console.log(`- ${startupsData.length} startups criadas`)
    console.log(`- ${investidoresData.length} investidores criados`)
    console.log(`- ${captacoesData.length} rodadas de captação criadas`)
    console.log('\n� IDs de usuários criados:')
    console.log('Startups:', startupUserIds)
    console.log('Investidores:', investidorUserIds)

  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
    process.exit(1)
  }
}

// Executar seed
seedDatabase()
