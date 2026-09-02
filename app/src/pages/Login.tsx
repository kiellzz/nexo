import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  TEST_LOGIN_DATA,
  TEST_SIGNUP_DATA,
} from '../data/testAccounts'
import type { UserRole } from '../types'
import { seedProfileFromSignup } from '../utils/userProfileStorage'

export function LoginPage({ setActiveRole }: { setActiveRole: (role: UserRole) => void }) {
  const [loginRole, setLoginRole] = useState<UserRole>('startup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [useTestData, setUseTestData] = useState(false)

  function preencherDadosAutomaticamenteParaTeste(role: UserRole) {
    const testLogin = TEST_LOGIN_DATA[role]

    setEmail(testLogin.email)
    setPassword(testLogin.password)
  }

  function handleTestDataToggle(checked: boolean) {
    setUseTestData(checked)

    if (checked) {
      preencherDadosAutomaticamenteParaTeste(loginRole)
      return
    }

    setEmail('')
    setPassword('')
  }

  function handleRoleSwitch(role: UserRole) {
    setLoginRole(role)

    if (useTestData) preencherDadosAutomaticamenteParaTeste(role)
  }

  function seedTestProfile(role: UserRole) {
    if (role === 'startup') {
      const startupData = TEST_SIGNUP_DATA.startup

      seedProfileFromSignup('startup', {
        name: startupData.name,
        email: startupData.email,
        description: startupData.description,
        stage: startupData.stage,
        sectors: startupData.sectors,
        investmentMin: startupData.investmentMin,
        investmentMax: startupData.investmentMax,
      })
      return
    }

    const investorData = TEST_SIGNUP_DATA.investor

    seedProfileFromSignup('investor', {
      name: investorData.name,
      email: investorData.email,
      investorType: investorData.investorType,
      areas: investorData.areas,
      ticketMin: investorData.ticketMin,
      ticketMax: investorData.ticketMax,
      city: investorData.city,
    })
  }

  function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (useTestData) seedTestProfile(loginRole)
    setActiveRole(loginRole)
  }

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={handleLoginSubmit}>
        <div className="auth-brand">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo large" />
          <span className="brand-name">Nexo</span>
        </div>

        <h2>Entrar na plataforma</h2>

        <div className="field-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </div>

        <div className="inline-row">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.currentTarget.checked)}
            />
            Lembrar de mim
          </label>
          <button type="button" className="text-link">Esqueci minha senha</button>
        </div>

        <div className="choice-row">
          <button
            type="button"
            className={loginRole === 'startup' ? 'choice-option active' : 'choice-option'}
            onClick={() => handleRoleSwitch('startup')}
          >
            Startup
          </button>
          <button
            type="button"
            className={loginRole === 'investor' ? 'choice-option active' : 'choice-option'}
            onClick={() => handleRoleSwitch('investor')}
          >
            Investidor
          </button>
        </div>

        <label className="checkbox-row test-autofill-row">
          <input
            type="checkbox"
            checked={useTestData}
            onChange={(event) => handleTestDataToggle(event.currentTarget.checked)}
          />
          <span>Preencher dados automaticamente para teste</span>
        </label>

        <button type="submit" className="btn btn-primary full">
          Entrar como {loginRole === 'startup' ? 'Startup' : 'Investidor'}
        </button>

        <p className="muted-text">
          Ainda não tem conta? <Link to="/signup" className="text-link">Cadastre-se</Link>
        </p>
      </form>
    </section>
  )
}
