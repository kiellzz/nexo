import type { StartupFormData, StartupAnalysis } from '../types'
import { mockAnalysis } from '../data/mockData'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

function buildPrompt(data: StartupFormData): string {
  const revenueNum = Number(data.annualRevenue)
  const costsNum = Number(data.monthlyCosts) * 12
  const margin = revenueNum > 0 ? (((revenueNum - costsNum) / revenueNum) * 100).toFixed(1) : '0'

  return `Você é um analista sênior de venture capital especializado em startups brasileiras. Analise os dados abaixo e retorne APENAS um JSON válido, sem markdown, sem texto adicional.

Dados da startup:
- Nome: ${data.name}
- Segmento: ${data.sector}
- Cidade: ${data.city}
- Descrição: ${data.description}
- Modelo de negócio: ${data.businessModel}
- Estágio: ${data.stage}
- Faturamento anual: R$ ${revenueNum.toLocaleString('pt-BR')}
- Crescimento mensal: ${data.momGrowth}%
- Número de clientes: ${data.customerCount}
- Custos mensais: R$ ${Number(data.monthlyCosts).toLocaleString('pt-BR')}
- Margem estimada: ${margin}%
- Captação desejada: R$ ${Number(data.targetAmount).toLocaleString('pt-BR')}
- Equity oferecido: ${data.equityOffered}%

Retorne EXATAMENTE este JSON preenchido (sem alterar as chaves):
{
  "score": <número 0-100>,
  "healthScore": <número 0-100>,
  "growthScore": <número 0-100>,
  "riskScore": <número 0-100, quanto menor melhor>,
  "strengths": ["ponto forte 1", "ponto forte 2", "ponto forte 3", "ponto forte 4"],
  "weaknesses": ["fraqueza 1", "fraqueza 2", "fraqueza 3"],
  "opportunities": ["oportunidade 1", "oportunidade 2", "oportunidade 3"],
  "threats": ["ameaça 1", "ameaça 2", "ameaça 3"],
  "summary": "análise completa em 3-4 frases",
  "marketAssessment": "avaliação do mercado em 2-3 frases",
  "recommendation": "approve" | "review" | "reject",
  "projections": {
    "months12": { "pessimistic": <crescimento %>, "realistic": <crescimento %>, "optimistic": <crescimento %> },
    "months24": { "pessimistic": <crescimento %>, "realistic": <crescimento %>, "optimistic": <crescimento %> }
  },
  "revenueProjection": {
    "months12": { "pessimistic": <valor em R$>, "realistic": <valor em R$>, "optimistic": <valor em R$> },
    "months24": { "pessimistic": <valor em R$>, "realistic": <valor em R$>, "optimistic": <valor em R$> }
  },
  "valuationProjection": {
    "months12": { "pessimistic": <valor em R$>, "realistic": <valor em R$>, "optimistic": <valor em R$> },
    "months24": { "pessimistic": <valor em R$>, "realistic": <valor em R$>, "optimistic": <valor em R$> }
  }
}`
}

export async function analyzeStartup(data: StartupFormData): Promise<StartupAnalysis> {
  if (!GEMINI_API_KEY) {
    // Fallback: simula delay de IA e retorna mock realista
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return mockAnalysis
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(data) }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const result = await response.json()
  const text: string = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'

  // Remove possíveis marcadores de markdown
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
  return JSON.parse(clean) as StartupAnalysis
}
