import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { UserRole } from '../types'
import { SECTOR_TAGS } from '../data/signupOptions'
import { TagSelector } from '../components/ui/TagSelector'
import { RangeSlider } from '../components/ui/RangeSlider'

// ─── Investment range constants ───────────────────────────────────────────────

const INVESTMENT_MIN_BOUND = 0
const INVESTMENT_MAX_BOUND = 2_000_000
const INVESTMENT_STEP = 10_000
const DEFAULT_INVESTMENT_MIN = 100_000
const DEFAULT_INVESTMENT_MAX = 500_000

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const commonFields = {
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Você precisa aceitar os termos para continuar',
  }),
}

const startupSchema = z
  .object({
    name: z.string().min(2, 'Nome da startup é obrigatório'),
    description: z.string().min(10, 'Descreva sua startup (mínimo 10 caracteres)'),
    stage: z.enum(['Pré-semente', 'Seed', 'Série A', 'Expansion']),
    sectors: z.array(z.string()).min(1, 'Selecione ao menos um segmento'),
    investmentMin: z.number().min(INVESTMENT_MIN_BOUND),
    investmentMax: z.number().max(INVESTMENT_MAX_BOUND),
    ...commonFields,
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não conferem',
  })
  .refine((d) => d.investmentMin < d.investmentMax, {
    path: ['investmentMax'],
    message: 'O valor máximo deve ser maior que o mínimo',
  })

const investorSchema = z
  .object({
    name: z.string().min(2, 'Nome é obrigatório'),
    investorType: z.enum(['Anjo', 'Fundo', 'Family Office']),
    areas: z.array(z.string()).min(1, 'Selecione ao menos uma área'),
    ticketMin: z.number().min(INVESTMENT_MIN_BOUND),
    ticketMax: z.number().max(INVESTMENT_MAX_BOUND),
    city: z.string().min(2, 'Localização é obrigatória'),
    ...commonFields,
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não conferem',
  })
  .refine((d) => d.ticketMin < d.ticketMax, {
    path: ['ticketMax'],
    message: 'O valor máximo deve ser maior que o mínimo',
  })

type StartupFormData = z.infer<typeof startupSchema>
type InvestorFormData = z.infer<typeof investorSchema>

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="spinner"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="40 20"
      />
    </svg>
  )
}

// ─── Field error ─────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="field-error">{message}</p>
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SignupPage({
  setActiveRole,
}: {
  setActiveRole: (role: UserRole) => void
}) {
  const [signupMode, setSignupMode] = useState<UserRole>('startup')
  const [loading, setLoading] = useState(false)

  // ── Startup form ────────────────────────────────────────────────────────────
  const startupForm = useForm<StartupFormData>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      stage: 'Seed',
      sectors: [],
      investmentMin: DEFAULT_INVESTMENT_MIN,
      investmentMax: DEFAULT_INVESTMENT_MAX,
    },
  })

  // ── Investor form ───────────────────────────────────────────────────────────
  const investorForm = useForm<InvestorFormData>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      investorType: 'Anjo',
      areas: [],
      ticketMin: DEFAULT_INVESTMENT_MIN,
      ticketMax: DEFAULT_INVESTMENT_MAX,
    },
  })

  // ── Toggle between modes ────────────────────────────────────────────────────
  function handleModeSwitch(mode: UserRole) {
    setSignupMode(mode)
    startupForm.reset()
    investorForm.reset()
  }

  // ── Submit handlers ─────────────────────────────────────────────────────────
  function handleStartupSubmit(_data: StartupFormData) {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setActiveRole('startup')
    }, 1500)
  }

  function handleInvestorSubmit(_data: InvestorFormData) {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setActiveRole('investor')
    }, 1500)
  }

  // ── Shared flag ────────────────────────────────────────────────────────────
  const isStartup = signupMode === 'startup'

  return (
    <section className="auth-shell">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand center">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo large" />
          <span className="brand-name">Nexo</span>
        </div>

        <h2>Comece a sua jornada</h2>

        {/* Toggle */}
        <div className="choice-row">
          <button
            type="button"
            className={isStartup ? 'choice-option active' : 'choice-option'}
            onClick={() => handleModeSwitch('startup')}
          >
            Sou uma Startup
          </button>
          <button
            type="button"
            className={!isStartup ? 'choice-option active' : 'choice-option'}
            onClick={() => handleModeSwitch('investor')}
          >
            Sou Investidor
          </button>
        </div>

        {/* ── STARTUP FORM ─────────────────────────────────────────────────── */}
        {isStartup && (
          <form onSubmit={startupForm.handleSubmit(handleStartupSubmit)} noValidate>
            {/* Name + Stage */}
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="s-name">Nome da startup</label>
                <input
                  id="s-name"
                  placeholder="NovaFlow"
                  className={startupForm.formState.errors.name ? 'input-error' : ''}
                  {...startupForm.register('name')}
                />
                <FieldError message={startupForm.formState.errors.name?.message} />
              </div>

              <div className="field-group">
                <label htmlFor="s-stage">Estágio</label>
                <select id="s-stage" {...startupForm.register('stage')}>
                  <option value="Pré-semente">Pré-semente</option>
                  <option value="Seed">Seed</option>
                  <option value="Série A">Série A</option>
                  <option value="Expansion">Expansion</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="field-group">
              <label htmlFor="s-desc">Descrição</label>
              <textarea
                id="s-desc"
                rows={3}
                placeholder="Descreva sua proposta de valor e trajetória."
                className={startupForm.formState.errors.description ? 'input-error' : ''}
                {...startupForm.register('description')}
              />
              <FieldError message={startupForm.formState.errors.description?.message} />
            </div>

            {/* Sectors multi-select */}
            <div className="field-group">
              <label>Segmentos</label>
              <Controller
                name="sectors"
                control={startupForm.control}
                render={({ field }) => (
                  <TagSelector
                    options={SECTOR_TAGS}
                    value={field.value}
                    onChange={field.onChange}
                    error={startupForm.formState.errors.sectors?.message}
                  />
                )}
              />
            </div>

            {/* Investment range */}
            <div className="field-group">
              <label>Investimento pretendido</label>
              <RangeSlider
                min={INVESTMENT_MIN_BOUND}
                max={INVESTMENT_MAX_BOUND}
                step={INVESTMENT_STEP}
                value={[
                  startupForm.watch('investmentMin'),
                  startupForm.watch('investmentMax'),
                ]}
                onChange={([lo, hi]) => {
                  startupForm.setValue('investmentMin', lo, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                  startupForm.setValue('investmentMax', hi, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
              />
              <FieldError message={startupForm.formState.errors.investmentMax?.message} />
            </div>

            {/* Email */}
            <div className="field-group">
              <label htmlFor="s-email">E-mail</label>
              <input
                id="s-email"
                type="email"
                placeholder="contato@suastartup.com"
                className={startupForm.formState.errors.email ? 'input-error' : ''}
                {...startupForm.register('email')}
              />
              <FieldError message={startupForm.formState.errors.email?.message} />
            </div>

            {/* Password */}
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="s-pw">Senha</label>
                <input
                  id="s-pw"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className={startupForm.formState.errors.password ? 'input-error' : ''}
                  {...startupForm.register('password')}
                />
                <FieldError message={startupForm.formState.errors.password?.message} />
              </div>
              <div className="field-group">
                <label htmlFor="s-cpw">Confirmar senha</label>
                <input
                  id="s-cpw"
                  type="password"
                  placeholder="Repita a senha"
                  className={startupForm.formState.errors.confirmPassword ? 'input-error' : ''}
                  {...startupForm.register('confirmPassword')}
                />
                <FieldError message={startupForm.formState.errors.confirmPassword?.message} />
              </div>
            </div>

            {/* Terms */}
            <div className="field-group">
              <label className="terms-row">
                <input type="checkbox" {...startupForm.register('terms')} />
                <span>
                  Li e aceito os{' '}
                  <a href="#" className="text-link">Termos de Uso</a> e{' '}
                  <a href="#" className="text-link">Política de Privacidade</a>
                </span>
              </label>
              <FieldError message={startupForm.formState.errors.terms?.message} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary full"
              disabled={loading}
              style={{ marginTop: '1.25rem' }}
            >
              {loading ? (
                <>
                  <Spinner />
                  Criando conta...
                </>
              ) : (
                'Criar conta como Startup'
              )}
            </button>
          </form>
        )}

        {/* ── INVESTOR FORM ─────────────────────────────────────────────────── */}
        {!isStartup && (
          <form onSubmit={investorForm.handleSubmit(handleInvestorSubmit)} noValidate>
            {/* Name + Type */}
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="i-name">Nome</label>
                <input
                  id="i-name"
                  placeholder="Helena Costa"
                  className={investorForm.formState.errors.name ? 'input-error' : ''}
                  {...investorForm.register('name')}
                />
                <FieldError message={investorForm.formState.errors.name?.message} />
              </div>

              <div className="field-group">
                <label htmlFor="i-type">Tipo</label>
                <select id="i-type" {...investorForm.register('investorType')}>
                  <option value="Anjo">Anjo</option>
                  <option value="Fundo">Fundo</option>
                  <option value="Family Office">Family Office</option>
                </select>
              </div>
            </div>

            {/* Areas multi-select */}
            <div className="field-group">
              <label>Áreas de interesse</label>
              <Controller
                name="areas"
                control={investorForm.control}
                render={({ field }) => (
                  <TagSelector
                    options={SECTOR_TAGS}
                    value={field.value}
                    onChange={field.onChange}
                    error={investorForm.formState.errors.areas?.message}
                  />
                )}
              />
            </div>

            {/* Ticket range */}
            <div className="field-group">
              <label>Faixa de investimento</label>
              <RangeSlider
                min={INVESTMENT_MIN_BOUND}
                max={INVESTMENT_MAX_BOUND}
                step={INVESTMENT_STEP}
                value={[
                  investorForm.watch('ticketMin'),
                  investorForm.watch('ticketMax'),
                ]}
                onChange={([lo, hi]) => {
                  investorForm.setValue('ticketMin', lo, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                  investorForm.setValue('ticketMax', hi, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
              />
              <FieldError message={investorForm.formState.errors.ticketMax?.message} />
            </div>

            {/* City */}
            <div className="field-group">
              <label htmlFor="i-city">Localização</label>
              <input
                id="i-city"
                placeholder="Belo Horizonte"
                className={investorForm.formState.errors.city ? 'input-error' : ''}
                {...investorForm.register('city')}
              />
              <FieldError message={investorForm.formState.errors.city?.message} />
            </div>

            {/* Email */}
            <div className="field-group">
              <label htmlFor="i-email">E-mail</label>
              <input
                id="i-email"
                type="email"
                placeholder="contato@email.com"
                className={investorForm.formState.errors.email ? 'input-error' : ''}
                {...investorForm.register('email')}
              />
              <FieldError message={investorForm.formState.errors.email?.message} />
            </div>

            {/* Password */}
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="i-pw">Senha</label>
                <input
                  id="i-pw"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className={investorForm.formState.errors.password ? 'input-error' : ''}
                  {...investorForm.register('password')}
                />
                <FieldError message={investorForm.formState.errors.password?.message} />
              </div>
              <div className="field-group">
                <label htmlFor="i-cpw">Confirmar senha</label>
                <input
                  id="i-cpw"
                  type="password"
                  placeholder="Repita a senha"
                  className={investorForm.formState.errors.confirmPassword ? 'input-error' : ''}
                  {...investorForm.register('confirmPassword')}
                />
                <FieldError message={investorForm.formState.errors.confirmPassword?.message} />
              </div>
            </div>

            {/* Terms */}
            <div className="field-group">
              <label className="terms-row">
                <input type="checkbox" {...investorForm.register('terms')} />
                <span>
                  Li e aceito os{' '}
                  <a href="#" className="text-link">Termos de Uso</a> e{' '}
                  <a href="#" className="text-link">Política de Privacidade</a>
                </span>
              </label>
              <FieldError message={investorForm.formState.errors.terms?.message} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary full"
              disabled={loading}
              style={{ marginTop: '1.25rem' }}
            >
              {loading ? (
                <>
                  <Spinner />
                  Criando conta...
                </>
              ) : (
                'Criar conta como Investidor'
              )}
            </button>
          </form>
        )}

        <p className="muted-text">
          Já tem uma conta?{' '}
          <a href="/login" className="text-link">
            Entrar
          </a>
        </p>
      </div>
    </section>
  )
}