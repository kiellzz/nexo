import { CheckCircle2, Handshake, UserRoundPlus } from 'lucide-react'
import { steps } from '../data/landing'
import { Reveal } from './Reveal'

const icons = [UserRoundPlus, Handshake, CheckCircle2] as const

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section" aria-labelledby="como-title">
      <div className="container">
        <Reveal className="section-heading">
          <p className="kicker">Uma jornada simples</p>
          <h2 id="como-title">Do cadastro ao match, sem complicação.</h2>
          <p>Perfis estruturados e rodadas claras ajudam cada lado a encontrar o que faz sentido.</p>
        </Reveal>
        <div className="steps-grid">
          <div className="steps-line" aria-hidden="true" />
          {steps.map((step, index) => {
            const Icon = icons[index]
            return (
              <Reveal className="step-card" delay={index * 70} key={step.number}>
                <div className={`step-icon ${index === 2 ? 'is-teal' : ''}`}><Icon aria-hidden="true" /></div>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
