export function SettingsPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <span className="label-badge">Painel de Controle</span>
          <h2>Configurações e Preferências</h2>
          <p className="section-desc">Gerencie seus dados de acesso, privacidade e notificações.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <h3>Dados Cadastrais</h3>
          <div className="field-group">
            <label htmlFor="settings-email">E-mail Principal</label>
            <input id="settings-email" defaultValue="contato@nexo.app" />
          </div>
          <div className="field-group">
            <label htmlFor="settings-loc">Localização / Hub Principal</label>
            <input id="settings-loc" defaultValue="São Paulo - SP" />
          </div>
          <button type="button" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>Salvar Alterações</button>
        </div>

        <div className="panel">
          <h3>Privacidade & Segurança</h3>
          <div className="checkbox-stack">
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Permitir contato direto por e-mail de perfis compatíveis</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Exibir perfil nos resultados de busca pública</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Receber alertas inteligentes de novos matches semanalmente</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
