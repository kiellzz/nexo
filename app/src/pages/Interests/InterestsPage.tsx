export function InterestsPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <span className="label-badge">Central de Relacionamento</span>
          <h2>Interesses e Conexões</h2>
          <p className="section-desc">Acompanhe o status de solicitações de contato enviadas e recebidas.</p>
        </div>
      </div>

      <div className="interest-layout">
        <div className="panel">
          <div className="panel-header">
            <h3>Interesses Enviados</h3>
            <span className="badge-counter">2 ativos</span>
          </div>
          <div className="mini-list">
            <div className="mini-item">
              <div>
                <strong>NovaFlow</strong>
                <span>Logística IA • Rodada Série A</span>
              </div>
              <span className="status-pill pending">Pendente</span>
            </div>
            <div className="mini-item">
              <div>
                <strong>GreenGrid</strong>
                <span>Energia Limpa • Seed</span>
              </div>
              <span className="status-pill accepted">Aceito</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Interesses Recebidos</h3>
            <span className="badge-counter">2 novos</span>
          </div>
          <div className="mini-list">
            <div className="mini-item">
              <div>
                <strong>Atlas Ventures</strong>
                <span>Fundo de VC • São Paulo</span>
              </div>
              <span className="status-pill new">Novo</span>
            </div>
            <div className="mini-item">
              <div>
                <strong>Helena Costa</strong>
                <span>Investidora Anjo • Belo Horizonte</span>
              </div>
              <span className="status-pill replied">Respondido</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
