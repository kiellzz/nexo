import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserRole } from '../types'

export function LoginPage({ setActiveRole }: { setActiveRole: (role: UserRole) => void }) {
  const [loginRole, setLoginRole] = useState<UserRole>('startup')

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo large" />
          <span className="brand-name">Nexo</span>
        </div>

        <h2>Entrar na plataforma</h2>

        <div className="field-group">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" placeholder="seu@email.com" />
        </div>

        <div className="field-group">
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>

        <div className="inline-row">
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Lembrar de mim
          </label>
          <button type="button" className="text-link">Esqueci minha senha</button>
        </div>

        <div className="choice-row">
          <button
            type="button"
            className={loginRole === 'startup' ? 'choice-option active' : 'choice-option'}
            onClick={() => setLoginRole('startup')}
          >
            Startup
          </button>
          <button
            type="button"
            className={loginRole === 'investor' ? 'choice-option active' : 'choice-option'}
            onClick={() => setLoginRole('investor')}
          >
            Investidor
          </button>
        </div>

        <button type="button" className="btn btn-primary full" onClick={() => setActiveRole(loginRole)}>
          Entrar como {loginRole === 'startup' ? 'Startup' : 'Investidor'}
        </button>

        <p className="muted-text">
          Ainda não tem conta? <Link to="/signup" className="text-link">Cadastre-se</Link>
        </p>
      </div>
    </section>
  )
}
