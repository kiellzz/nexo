import { ArrowRight, LogOut } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { z } from 'zod'
import { signOut } from '../auth/authApi'
import { useAuth } from '../auth/useAuth'
import { fasesStartup, tiposInvestidor } from '../data/perfil'
import { carregarSegmentos, salvarPerfilInvestidor, salvarPerfilStartup, type SegmentoOption } from '../lib/perfilApi'
import { traduzirErroSupabase } from '../lib/supabaseErrors'
import { mascararCnpj, mascararCpf, somenteDigitos, validarCnpj, validarCpf } from '../utils/documentos'
import { Brand } from './Brand'

interface OnboardingPageProps {
  onComplete: () => void
}

const startupSchema = z.object({
  nomeResponsavel: z.string().trim().min(2, 'Informe o nome do responsável.'),
  nomeStartup: z.string().trim().min(2, 'Informe o nome da startup.'),
  cnpj: z.string().refine(validarCnpj, 'Informe um CNPJ válido.'),
  fase: z.enum(fasesStartup, { message: 'Escolha a fase da startup.' }),
  segmentoId: z.coerce.number().int().positive('Escolha um segmento.'),
  descricao: z.string().trim().min(10, 'Descreva a startup em pelo menos 10 caracteres.').max(500, 'Use no máximo 500 caracteres.'),
})

const investidorSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome.'),
  cpf: z.string().refine(validarCpf, 'Informe um CPF válido.'),
  tipo: z.enum(tiposInvestidor, { message: 'Escolha o tipo de investidor.' }),
  biografia: z.string().trim().min(10, 'Escreva uma biografia curta.').max(500, 'Use no máximo 500 caracteres.'),
  ticketMin: z.coerce.number().min(0, 'Informe um valor mínimo válido.'),
  ticketMax: z.coerce.number().min(0, 'Informe um valor máximo válido.'),
  segmentos: z.array(z.number()).min(1, 'Escolha pelo menos um segmento.'),
}).refine((data) => data.ticketMin <= data.ticketMax, {
  path: ['ticketMax'],
  message: 'O valor máximo deve ser maior ou igual ao mínimo.',
})

interface StartupValues {
  nomeResponsavel: string
  nomeStartup: string
  cnpj: string
  fase: string
  segmentoId: number
  descricao: string
}

interface InvestidorValues {
  nome: string
  cpf: string
  tipo: string
  biografia: string
  ticketMin: number
  ticketMax: number
  segmentos: number[]
}
type StartupField = keyof StartupValues
type InvestidorField = keyof InvestidorValues

const startupInitial: StartupValues = {
  nomeResponsavel: '',
  nomeStartup: '',
  cnpj: '',
  fase: 'MVP',
  segmentoId: 0,
  descricao: '',
}

const investidorInitial: InvestidorValues = {
  nome: '',
  cpf: '',
  tipo: 'Investidor-anjo',
  biografia: '',
  ticketMin: 10000,
  ticketMax: 50000,
  segmentos: [],
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { usuario, user, refresh } = useAuth()
  const [segmentos, setSegmentos] = useState<SegmentoOption[]>([])
  const [startupValues, setStartupValues] = useState<StartupValues>(startupInitial)
  const [investidorValues, setInvestidorValues] = useState<InvestidorValues>(investidorInitial)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    void carregarSegmentos()
      .then((items) => {
        if (active) setSegmentos(items)
      })
      .catch(() => {
        if (active) setServerError('Não foi possível carregar os segmentos. Tente novamente.')
      })
    return () => {
      active = false
    }
  }, [])

  const title = usuario?.tipo === 'startup' ? 'Complete o perfil da sua startup.' : 'Complete seu perfil de investidor.'

  const selectedSegmentNames = useMemo(
    () => segmentos.filter((segmento) => investidorValues.segmentos.includes(segmento.id)).map((segmento) => segmento.nome),
    [segmentos, investidorValues.segmentos],
  )

  if (!usuario || !user) {
    return (
      <main id="conteudo" className="onboarding-shell">
        <section className="onboarding-card">
          <Brand />
          <h1>Perfil base não encontrado.</h1>
          <p>Saia e faça um novo cadastro.</p>
          <button className="button button-outline" type="button" onClick={() => void signOut()}>
            <LogOut size={18} aria-hidden="true" />
            Sair
          </button>
        </section>
      </main>
    )
  }

  const setStartupField = (field: StartupField, value: StartupValues[StartupField]) => {
    setStartupValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: '' }))
    setServerError('')
  }

  const setInvestidorField = (field: InvestidorField, value: InvestidorValues[InvestidorField]) => {
    setInvestidorValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: '' }))
    setServerError('')
  }

  const applyErrors = (error: z.ZodError) => {
    const next: Record<string, string> = {}
    error.issues.forEach((issue) => {
      const field = String(issue.path[0])
      if (!next[field]) next[field] = issue.message
    })
    setFieldErrors(next)
  }

  const handleStartupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = startupSchema.safeParse(startupValues)
    if (!parsed.success) {
      applyErrors(parsed.error)
      return
    }

    setLoading(true)
    setServerError('')
    try {
      await salvarPerfilStartup({
        usuarioId: user.id,
        nomeResponsavel: parsed.data.nomeResponsavel.trim(),
        nomeStartup: parsed.data.nomeStartup.trim(),
        cnpj: somenteDigitos(parsed.data.cnpj),
        fase: parsed.data.fase,
        segmentoId: parsed.data.segmentoId,
        descricao: parsed.data.descricao.trim(),
      })
      await refresh()
      onComplete()
    } catch (error) {
      setServerError(traduzirErroSupabase(error))
    } finally {
      setLoading(false)
    }
  }

  const handleInvestidorSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = investidorSchema.safeParse(investidorValues)
    if (!parsed.success) {
      applyErrors(parsed.error)
      return
    }

    setLoading(true)
    setServerError('')
    try {
      await salvarPerfilInvestidor({
        usuarioId: user.id,
        nome: parsed.data.nome.trim(),
        cpf: somenteDigitos(parsed.data.cpf),
        tipo: parsed.data.tipo,
        biografia: parsed.data.biografia.trim(),
        ticketMin: parsed.data.ticketMin,
        ticketMax: parsed.data.ticketMax,
        segmentos: parsed.data.segmentos,
      })
      await refresh()
      onComplete()
    } catch (error) {
      setServerError(traduzirErroSupabase(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main id="conteudo" className="onboarding-shell">
      <section className="onboarding-card" aria-labelledby="onboarding-title">
        <div className="onboarding-top">
          <Brand />
          <button className="button button-ghost button-compact" type="button" onClick={() => void signOut()}>
            <LogOut size={17} aria-hidden="true" />
            Sair
          </button>
        </div>
        <p className="kicker">Onboarding</p>
        <h1 id="onboarding-title">{title}</h1>
        <p className="auth-description">Esses dados ajudam o Nexo a preparar seu painel inicial.</p>

        {usuario.tipo === 'startup' ? (
          <form className="profile-form" onSubmit={handleStartupSubmit} noValidate>
            <Field label="Nome do responsável" error={fieldErrors.nomeResponsavel}>
              <input value={startupValues.nomeResponsavel} onChange={(event) => setStartupField('nomeResponsavel', event.target.value)} />
            </Field>
            <Field label="Nome da startup" error={fieldErrors.nomeStartup}>
              <input value={startupValues.nomeStartup} onChange={(event) => setStartupField('nomeStartup', event.target.value)} />
            </Field>
            <Field label="CNPJ" error={fieldErrors.cnpj}>
              <input inputMode="numeric" value={startupValues.cnpj} onChange={(event) => setStartupField('cnpj', mascararCnpj(event.target.value))} />
            </Field>
            <div className="profile-grid">
              <Field label="Fase" error={fieldErrors.fase}>
                <select value={startupValues.fase} onChange={(event) => setStartupField('fase', event.target.value)}>
                  {fasesStartup.map((fase) => <option key={fase} value={fase}>{fase}</option>)}
                </select>
              </Field>
              <Field label="Segmento" error={fieldErrors.segmentoId}>
                <select value={startupValues.segmentoId} onChange={(event) => setStartupField('segmentoId', Number(event.target.value))}>
                  <option value={0}>Selecione</option>
                  {segmentos.map((segmento) => <option key={segmento.id} value={segmento.id}>{segmento.nome}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Descrição" error={fieldErrors.descricao}>
              <textarea maxLength={500} rows={5} value={startupValues.descricao} onChange={(event) => setStartupField('descricao', event.target.value)} />
            </Field>
            <SubmitArea loading={loading} error={serverError} />
          </form>
        ) : (
          <form className="profile-form" onSubmit={handleInvestidorSubmit} noValidate>
            <Field label="Nome" error={fieldErrors.nome}>
              <input value={investidorValues.nome} onChange={(event) => setInvestidorField('nome', event.target.value)} />
            </Field>
            <Field label="CPF" error={fieldErrors.cpf}>
              <input inputMode="numeric" value={investidorValues.cpf} onChange={(event) => setInvestidorField('cpf', mascararCpf(event.target.value))} />
            </Field>
            <Field label="Tipo de investidor" error={fieldErrors.tipo}>
              <select value={investidorValues.tipo} onChange={(event) => setInvestidorField('tipo', event.target.value)}>
                {tiposInvestidor.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </Field>
            <div className="profile-grid">
              <Field label="Ticket mínimo" error={fieldErrors.ticketMin}>
                <input type="number" min={0} value={investidorValues.ticketMin} onChange={(event) => setInvestidorField('ticketMin', Number(event.target.value))} />
              </Field>
              <Field label="Ticket máximo" error={fieldErrors.ticketMax}>
                <input type="number" min={0} value={investidorValues.ticketMax} onChange={(event) => setInvestidorField('ticketMax', Number(event.target.value))} />
              </Field>
            </div>
            <Field label="Biografia" error={fieldErrors.biografia}>
              <textarea maxLength={500} rows={5} value={investidorValues.biografia} onChange={(event) => setInvestidorField('biografia', event.target.value)} />
            </Field>
            <fieldset className="segment-selector">
              <legend>Segmentos de interesse</legend>
              <div>
                {segmentos.map((segmento) => {
                  const selected = investidorValues.segmentos.includes(segmento.id)
                  return (
                    <button
                      className={selected ? 'is-selected' : ''}
                      key={segmento.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        const next = selected
                          ? investidorValues.segmentos.filter((id) => id !== segmento.id)
                          : [...investidorValues.segmentos, segmento.id]
                        setInvestidorField('segmentos', next)
                      }}
                    >
                      {segmento.nome}
                    </button>
                  )
                })}
              </div>
              {selectedSegmentNames.length > 0 && <small>Selecionados: {selectedSegmentNames.join(', ')}</small>}
              {fieldErrors.segmentos && <small className="form-error">{fieldErrors.segmentos}</small>}
            </fieldset>
            <SubmitArea loading={loading} error={serverError} />
          </form>
        )}
      </section>
    </main>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="profile-field">
      <span>{label}</span>
      {children}
      {error && <small className="form-error">{error}</small>}
    </label>
  )
}

function SubmitArea({ loading, error }: { loading: boolean; error: string }) {
  return (
    <>
      {error && <p className="form-alert" role="alert">{error}</p>}
      <button className="button button-navy auth-submit" type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar e acessar'}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </>
  )
}
