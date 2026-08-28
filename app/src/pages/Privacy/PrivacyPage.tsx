export function PrivacyPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <span className="label-badge">Termos Legais</span>
          <h2>Privacidade, Termos & LGPD</h2>
          <p className="section-desc">Transparência total no tratamento de dados e segurança de informações.</p>
        </div>
      </div>

      <div className="privacy-card">
        <h3>1. Consentimento e Tratamento de Dados</h3>
        <p>
          Ao utilizar a plataforma Nexo, você concorda com o processamento dos dados empresariais e de contato informados para fins exclusivos de matchmaking, geração de scores de compatibilidade e recomendações no ecossistema.
        </p>
        
        <h3>2. Política de Privacidade & Confidencialidade</h3>
        <p>
          As informações de tração financeira e métricas confidenciais são protegidas por criptografia de ponta a ponta e apenas compartilhadas mediante autorização explícita do fundador ou investidor. Não comercializamos dados de usuários com terceiros.
        </p>
        
        <h3>3. Direitos do Titular (LGPD)</h3>
        <p>
          Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar a qualquer momento a visualização, correção, anonimização ou exclusão definitiva dos seus dados através do nosso canal de privacidade ou nas configurações da conta.
        </p>
      </div>
    </section>
  )
}
