import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { RangeSlider } from '../../components/ui/RangeSlider'
import { TagSelector } from '../../components/ui/TagSelector'
import { SECTOR_TAGS, SLIDER_MAX, SLIDER_MIN, SLIDER_STEP } from '../../data/signupOptions'
import type { InvestorUserProfile, StartupUserProfile, UserProfile } from '../../types'
import { ProfilePhotoCropper } from './ProfilePhotoCropper'
import {
  INVESTOR_TYPES,
  PROFILE_STARTUP_STAGES,
  investorProfileSchema,
  startupProfileSchema,
  type InvestorProfileFormData,
  type StartupProfileFormData,
} from './profileSchemas'

type FormMode = 'completion' | 'edit'
type LocationStatus = 'idle' | 'loading' | 'success' | 'error'

interface UserProfileFormProps {
  mode: FormMode
  profile: UserProfile
  loading: boolean
  onSubmit: (profile: UserProfile) => void | Promise<void>
}

interface StartupFormProps {
  mode: FormMode
  profile: StartupUserProfile
  loading: boolean
  onSubmit: (profile: StartupUserProfile) => void | Promise<void>
}

interface InvestorFormProps {
  mode: FormMode
  profile: InvestorUserProfile
  loading: boolean
  onSubmit: (profile: InvestorUserProfile) => void | Promise<void>
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="field-error">{message}</p>
}

function emptyStringToOptionalNumber(value: unknown) {
  if (value === '' || value === null || value === undefined) return undefined
  return Number(value)
}

interface ReverseGeocodeResponse {
  city?: string
  locality?: string
  principalSubdivisionCode?: string
  principalSubdivision?: string
}

interface LocationFieldsProps {
  cityId: string
  stateId: string
  cityRegistration: UseFormRegisterReturn<'city'>
  stateRegistration: UseFormRegisterReturn<'state'>
  cityError?: string
  stateError?: string
  onLocationDetected: (city: string, state: string) => void
}

function getStateCode(response: ReverseGeocodeResponse) {
  const subdivisionCode = response.principalSubdivisionCode?.split('-').at(-1)?.trim()
  const subdivision = response.principalSubdivision?.trim()

  return (subdivisionCode || subdivision || '').slice(0, 2).toUpperCase()
}

async function resolveBrowserLocation() {
  if (!('geolocation' in navigator)) {
    throw new Error('Seu navegador não oferece localização automática.')
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 300_000,
      timeout: 10_000,
    })
  })

  const { latitude, longitude } = position.coords
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`,
  )

  if (!response.ok) {
    throw new Error('Não foi possível converter sua localização em cidade e estado.')
  }

  const data = await response.json() as ReverseGeocodeResponse
  const city = data.city || data.locality || ''
  const state = getStateCode(data)

  if (!city || !state) {
    throw new Error('Localização encontrada, mas cidade/estado não foram identificados.')
  }

  return { city, state }
}

function LocationFields({
  cityId,
  stateId,
  cityRegistration,
  stateRegistration,
  cityError,
  stateError,
  onLocationDetected,
}: LocationFieldsProps) {
  const [status, setStatus] = useState<LocationStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function handleUseCurrentLocation() {
    setStatus('loading')
    setMessage('O navegador vai pedir permissão para acessar sua localização.')

    try {
      const location = await resolveBrowserLocation()
      onLocationDetected(location.city, location.state)
      setStatus('success')
      setMessage(`Localização definida como ${location.city} - ${location.state}.`)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Não foi possível detectar sua localização.')
    }
  }

  return (
    <div className="location-fields">
      <div className="location-fields-header">
        <div>
          <span className="location-fields-label">Localização</span>
          <p>Você pode preencher manualmente ou permitir a detecção automática.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary small"
          onClick={handleUseCurrentLocation}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Detectando...' : 'Usar minha localização'}
        </button>
      </div>

      {message && (
        <p className={status === 'error' ? 'location-status error' : 'location-status'}>
          {message}
        </p>
      )}

      <div className="field-grid two-col">
        <div className="field-group">
          <label htmlFor={cityId}>Cidade</label>
          <input id={cityId} {...cityRegistration} />
          <FieldError message={cityError} />
        </div>

        <div className="field-group">
          <label htmlFor={stateId}>Estado</label>
          <input id={stateId} maxLength={2} {...stateRegistration} />
          <FieldError message={stateError} />
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function StartupForm({
  mode,
  profile,
  loading,
  onSubmit,
}: StartupFormProps) {
  const form = useForm<StartupProfileFormData>({
    resolver: zodResolver(startupProfileSchema),
    defaultValues: profile,
  })
  const pitch = useWatch({ control: form.control, name: 'pitch' }) ?? ''
  const investmentMin = useWatch({ control: form.control, name: 'investmentMin' })
  const investmentMax = useWatch({ control: form.control, name: 'investmentMax' })
  const name = useWatch({ control: form.control, name: 'name' }) || profile.name

  return (
    <form
      className="user-profile-form"
      onSubmit={form.handleSubmit((data) => onSubmit({ ...profile, ...data }))}
      noValidate
    >
      <section className="profile-form-section">
        <div>
          <span className="label-badge">Etapa 1</span>
          <h3>Imagem e resumo</h3>
          <p>Esses dados aparecem primeiro quando um investidor avalia seu perfil.</p>
        </div>

        <Controller
          name="photoUrl"
          control={form.control}
          render={({ field }) => (
            <ProfilePhotoCropper
              value={field.value}
              fallbackText={name}
              label="Logo ou foto da startup"
              onChange={field.onChange}
            />
          )}
        />

        <div className="field-grid two-col">
          <div className="field-group">
            <label htmlFor="startup-name">Nome da startup</label>
            <input id="startup-name" {...form.register('name')} />
            <FieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="field-group">
            <label htmlFor="startup-email">E-mail</label>
            <input id="startup-email" type="email" {...form.register('email')} />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="startup-pitch">Descrição curta / pitch</label>
          <textarea id="startup-pitch" rows={4} maxLength={280} {...form.register('pitch')} />
          <div className="textarea-counter">{pitch.length}/280</div>
          <FieldError message={form.formState.errors.pitch?.message} />
        </div>
      </section>

      <section className="profile-form-section">
        <div>
          <span className="label-badge">Etapa 2</span>
          <h3>Dados da empresa</h3>
          <p>Ajuda o algoritmo a entender momento, tese e maturidade da startup.</p>
        </div>

        <div className="field-group">
          <label htmlFor="startup-stage">Estágio</label>
          <select id="startup-stage" {...form.register('stage')}>
            {PROFILE_STARTUP_STAGES.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        <div className="field-grid three-col">
          <div className="field-group">
            <label htmlFor="founded-year">Ano de fundação</label>
            <input
              id="founded-year"
              type="number"
              placeholder="2023"
              {...form.register('foundedYear', { setValueAs: emptyStringToOptionalNumber })}
            />
            <FieldError message={form.formState.errors.foundedYear?.message} />
          </div>

          <div className="field-group">
            <label htmlFor="founders-count">Fundadores</label>
            <input
              id="founders-count"
              type="number"
              placeholder="2"
              {...form.register('foundersCount', { setValueAs: emptyStringToOptionalNumber })}
            />
            <FieldError message={form.formState.errors.foundersCount?.message} />
          </div>

          <div className="field-group">
            <label htmlFor="team-size">Time</label>
            <input
              id="team-size"
              type="number"
              placeholder="12"
              {...form.register('teamSize', { setValueAs: emptyStringToOptionalNumber })}
            />
            <FieldError message={form.formState.errors.teamSize?.message} />
          </div>
        </div>

        <LocationFields
          cityId="startup-city"
          stateId="startup-state"
          cityRegistration={form.register('city')}
          stateRegistration={form.register('state')}
          cityError={form.formState.errors.city?.message}
          stateError={form.formState.errors.state?.message}
          onLocationDetected={(city, state) => {
            form.setValue('city', city, { shouldDirty: true, shouldValidate: true })
            form.setValue('state', state, { shouldDirty: true, shouldValidate: true })
          }}
        />
      </section>

      <section className="profile-form-section">
        <div>
          <span className="label-badge">Etapa 3</span>
          <h3>Interesses e presença digital</h3>
          <p>Quanto mais claros forem os sinais, melhor fica a ordenação dos matches.</p>
        </div>

        <div className="field-group">
          <label>Faixa de investimento buscada</label>
          <RangeSlider
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={SLIDER_STEP}
            value={[investmentMin, investmentMax]}
            onChange={([lo, hi]) => {
              form.setValue('investmentMin', lo, { shouldDirty: true, shouldValidate: true })
              form.setValue('investmentMax', hi, { shouldDirty: true, shouldValidate: true })
            }}
          />
          <FieldError message={form.formState.errors.investmentMax?.message} />
        </div>

        <div className="field-group">
          <label>Tags / palavras-chave</label>
          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => (
              <TagSelector
                options={SECTOR_TAGS}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.tags?.message}
              />
            )}
          />
        </div>

        <div className="field-grid three-col">
          <div className="field-group">
            <label htmlFor="startup-site">Site</label>
            <input id="startup-site" placeholder="https://..." {...form.register('website')} />
          </div>
          <div className="field-group">
            <label htmlFor="startup-linkedin">LinkedIn</label>
            <input id="startup-linkedin" placeholder="https://linkedin.com/..." {...form.register('linkedin')} />
          </div>
          <div className="field-group">
            <label htmlFor="startup-instagram">Instagram</label>
            <input id="startup-instagram" placeholder="@perfil" {...form.register('instagram')} />
          </div>
        </div>
      </section>

      <div className="profile-form-actions">
        {mode === 'edit' && <Link to="/dashboard" className="btn btn-secondary">Voltar</Link>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><Spinner /> Salvando...</> : mode === 'edit' ? 'Salvar alterações' : 'Concluir perfil'}
        </button>
      </div>
    </form>
  )
}

function InvestorForm({
  mode,
  profile,
  loading,
  onSubmit,
}: InvestorFormProps) {
  const form = useForm<InvestorProfileFormData>({
    resolver: zodResolver(investorProfileSchema),
    defaultValues: profile,
  })
  const bio = useWatch({ control: form.control, name: 'bio' }) ?? ''
  const ticketMin = useWatch({ control: form.control, name: 'ticketMin' })
  const ticketMax = useWatch({ control: form.control, name: 'ticketMax' })
  const name = useWatch({ control: form.control, name: 'name' }) || profile.name

  return (
    <form
      className="user-profile-form"
      onSubmit={form.handleSubmit((data) => onSubmit({ ...profile, ...data }))}
      noValidate
    >
      <section className="profile-form-section">
        <div>
          <span className="label-badge">Etapa 1</span>
          <h3>Imagem e tese pessoal</h3>
          <p>Esses dados ajudam startups a entender seu foco antes de qualquer contato.</p>
        </div>

        <Controller
          name="photoUrl"
          control={form.control}
          render={({ field }) => (
            <ProfilePhotoCropper
              value={field.value}
              fallbackText={name}
              label="Foto de perfil"
              onChange={field.onChange}
            />
          )}
        />

        <div className="field-grid two-col">
          <div className="field-group">
            <label htmlFor="investor-name">Nome</label>
            <input id="investor-name" {...form.register('name')} />
            <FieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="field-group">
            <label htmlFor="investor-email">E-mail</label>
            <input id="investor-email" type="email" {...form.register('email')} />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="investor-bio">Bio / descrição</label>
          <textarea id="investor-bio" rows={4} maxLength={320} {...form.register('bio')} />
          <div className="textarea-counter">{bio.length}/320</div>
          <FieldError message={form.formState.errors.bio?.message} />
        </div>
      </section>

      <section className="profile-form-section">
        <div>
          <span className="label-badge">Etapa 2</span>
          <h3>Preferências de investimento</h3>
          <p>O Nexo usa esses sinais para cruzar ticket, setor e estágio com startups compatíveis.</p>
        </div>

        <div className="field-grid two-col">
          <div className="field-group">
            <label htmlFor="investor-type">Tipo de investidor</label>
            <select id="investor-type" {...form.register('investorType')}>
              {INVESTOR_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Ticket médio de investimento</label>
            <RangeSlider
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={SLIDER_STEP}
              value={[ticketMin, ticketMax]}
              onChange={([lo, hi]) => {
                form.setValue('ticketMin', lo, { shouldDirty: true, shouldValidate: true })
                form.setValue('ticketMax', hi, { shouldDirty: true, shouldValidate: true })
              }}
            />
            <FieldError message={form.formState.errors.ticketMax?.message} />
          </div>
        </div>

        <div className="field-group">
          <label>Setores de interesse</label>
          <Controller
            name="interests"
            control={form.control}
            render={({ field }) => (
              <TagSelector
                options={SECTOR_TAGS}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.interests?.message}
              />
            )}
          />
        </div>
      </section>

      <section className="profile-form-section">
        <div>
          <span className="label-badge">Etapa 3</span>
          <h3>Localização e presença</h3>
          <p>Localização e histórico público aumentam confiança antes da conversa.</p>
        </div>

        <LocationFields
          cityId="investor-city"
          stateId="investor-state"
          cityRegistration={form.register('city')}
          stateRegistration={form.register('state')}
          cityError={form.formState.errors.city?.message}
          stateError={form.formState.errors.state?.message}
          onLocationDetected={(city, state) => {
            form.setValue('city', city, { shouldDirty: true, shouldValidate: true })
            form.setValue('state', state, { shouldDirty: true, shouldValidate: true })
          }}
        />

        <div className="field-grid two-col">
          <div className="field-group">
            <label htmlFor="investor-linkedin">LinkedIn</label>
            <input id="investor-linkedin" placeholder="https://linkedin.com/..." {...form.register('linkedin')} />
          </div>
          <div className="field-group">
            <label htmlFor="investor-site">Site</label>
            <input id="investor-site" placeholder="https://..." {...form.register('website')} />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="investor-portfolio">Portfólio</label>
          <textarea
            id="investor-portfolio"
            rows={3}
            placeholder="Empresas já investidas, separadas por vírgula"
            {...form.register('portfolio')}
          />
          <FieldError message={form.formState.errors.portfolio?.message} />
        </div>
      </section>

      <div className="profile-form-actions">
        {mode === 'edit' && <Link to="/dashboard" className="btn btn-secondary">Voltar</Link>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><Spinner /> Salvando...</> : mode === 'edit' ? 'Salvar alterações' : 'Concluir perfil'}
        </button>
      </div>
    </form>
  )
}

export function UserProfileForm(props: UserProfileFormProps) {
  if (props.profile.role === 'startup') {
    return (
      <StartupForm
        mode={props.mode}
        profile={props.profile}
        loading={props.loading}
        onSubmit={(profile) => props.onSubmit(profile)}
      />
    )
  }

  return (
    <InvestorForm
      mode={props.mode}
      profile={props.profile}
      loading={props.loading}
      onSubmit={(profile) => props.onSubmit(profile)}
    />
  )
}
