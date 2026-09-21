import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-title">
      <div className="final-network" aria-hidden="true" />
      <Reveal className="container final-inner">
        <div>
          <p>Seu próximo match pode começar aqui.</p>
          <h2 id="final-title">Pronto para dar o próximo passo?</h2>
        </div>
        <div className="final-actions">
          <a className="button button-white" href="/cadastro/startup">Sou startup<ArrowRight size={18} aria-hidden="true" /></a>
          <a className="button button-white-outline" href="/cadastro/investidor">Sou investidor<ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </Reveal>
    </section>
  )
}
