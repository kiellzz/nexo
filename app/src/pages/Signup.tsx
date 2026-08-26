import { useState } from 'react'
import type { UserRole } from '../types'

export function SignupPage({ setActiveRole }: { setActiveRole: (role: UserRole) => void }) {
  const [signupMode, setSignupMode] = useState<UserRole>('startup')

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand center">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo large" />
          <span className="brand-name">Nexo</span>
        </div>

        <h2>Comece a sua jornada</h2>

        <div className="choice-row">
          <button
            type="button"
            className={signupMode === 'startup' ? 'choice-option active' : 'choice-option'}
            onClick={() => setSignupMode('startup')}
          >
            Sou uma Startup
          </button>
          <button
            type="button"
            className={signupMode === 'investor' ? 'choice-option active' : 'choice-option'}
            onClick={() => setSignupMode('investor')}
          >
            Sou Investidor
          </button>
        </div>

        {signupMode === 'startup' ? (
          <>
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="startup-name">Nome da startup</label>
                <input id="startup-name" placeholder="NovaFlow" />
              </div>
              <div className="field-group">
                <label htmlFor="segment">Segmento</label>
                <input id="segment" placeholder="Logística IA" />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="startup-desc">Descrição</label>
              <textarea id="startup-desc" rows={4} placeholder="Descreva sua proposta de valor e trajetória." />
            </div>

            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="stage">Estágio</label>
                <select id="stage" defaultValue="Seed">
                  <option>Pré-semente</option>
                  <option>Seed</option>
                  <option>Série A</option>
                  <option>Expansion</option>
                </select>
              </div>
              <div className="field-group">
                <label htmlFor="ticket">Investimento pretendido</label>
                <input id="ticket" placeholder="R$ 750k" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="investor-name">Nome</label>
                <input id="investor-name" placeholder="Helena Costa" />
              </div>
              <div className="field-group">
                <label htmlFor="investor-type">Tipo</label>
                <select id="investor-type" defaultValue="Anjo">
                  <option>Anjo</option>
                  <option>Fundo</option>
                  <option>Family Office</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="areas">Áreas de interesse</label>
              <input id="areas" placeholder="IA, Saúde, B2B" />
            </div>

            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="focus">Faixa de investimento</label>
                <input id="focus" placeholder="R$ 300k - R$ 1M" />
              </div>
              <div className="field-group">
                <label htmlFor="city">Localização</label>
                <input id="city" placeholder="Belo Horizonte" />
              </div>
            </div>
          </>
        )}

        <button type="button" className="btn btn-primary full" onClick={() => setActiveRole(signupMode)}>
          Criar conta como {signupMode === 'startup' ? 'Startup' : 'Investidor'}
        </button>
      </div>
    </section>
  )
}
