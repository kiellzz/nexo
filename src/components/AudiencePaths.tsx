import { ArrowUpRight, Check } from 'lucide-react'
import { audiences } from '../data/landing'
import { Reveal } from './Reveal'

export function AudiencePaths() {
  return (
    <section id="comecar" className="section section-soft" aria-labelledby="paths-title">
      <div className="container">
        <Reveal className="section-heading section-heading-left">
          <p className="kicker">Dois caminhos, o mesmo ponto de encontro</p>
          <h2 id="paths-title">Escolha como você quer começar.</h2>
        </Reveal>
        <div className="audience-grid">
          {audiences.map((audience, index) => (
            <Reveal className={`audience-card audience-${audience.type}`} delay={index * 80} key={audience.type}>
              <article id={`para-${audience.type === 'startup' ? 'startups' : 'investidores'}`}>
                <div className="audience-accent" aria-hidden="true" />
                <p className="audience-eyebrow">{audience.eyebrow}</p>
                <h3>{audience.title}</h3>
                <ul>
                  {audience.items.map((item) => <li key={item}><Check size={18} aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
                <a className={`button button-${audience.type === 'startup' ? 'navy' : 'teal'}`} href={audience.href}>
                  {audience.cta}<ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
