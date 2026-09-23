import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export function SwaggerUiPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically load Swagger UI CSS and JS if not already loaded
    const cssId = 'swagger-ui-css'
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link')
      link.id = cssId
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css'
      document.head.appendChild(link)
    }

    const scriptBundleId = 'swagger-ui-bundle'
    const scriptPresetId = 'swagger-ui-preset'

    function initSwagger() {
      // @ts-expect-error SwaggerUIBundle is loaded globally via CDN
      if (window.SwaggerUIBundle && containerRef.current) {
        // @ts-expect-error SwaggerUIBundle is loaded globally via CDN
        window.SwaggerUIBundle({
          url: '/openapi.json',
          domNode: containerRef.current,
          deepLinking: true,
          // @ts-expect-error SwaggerUIBundle presets
          presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIStandalonePreset],
          layout: 'BaseLayout',
          defaultModelsExpandDepth: 2,
          defaultModelExpandDepth: 2,
          docExpansion: 'list',
          displayRequestDuration: true,
          filter: true,
        })
      }
    }

    if (!document.getElementById(scriptBundleId)) {
      const script1 = document.createElement('script')
      script1.id = scriptBundleId
      script1.src = 'https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js'
      script1.onload = () => {
        if (!document.getElementById(scriptPresetId)) {
          const script2 = document.createElement('script')
          script2.id = scriptPresetId
          script2.src = 'https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js'
          script2.onload = initSwagger
          document.body.appendChild(script2)
        } else {
          initSwagger()
        }
      }
      document.body.appendChild(script1)
    } else {
      initSwagger()
    }
  }, [])

  return (
    <div className="crud-page-container" style={{ maxWidth: '1300px' }}>
      <div className="crud-top-nav">
        <Link to="/startups" className="crud-back-link">
          &larr; Voltar para Startups (CRUD)
        </Link>
        <div className="crud-header-actions">
          <a
            href="/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-crud-secondary"
          >
            Abrir em Nova Aba ↗
          </a>
          <a
            href="/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-crud-secondary"
          >
            Ver openapi.json
          </a>
        </div>
      </div>

      <div className="crud-header" style={{ marginBottom: '1rem' }}>
        <div>
          <div className="crud-badge">OpenAPI 3.0 &bull; Interactive UI</div>
          <h1 className="crud-title">Documentação Interativa (Swagger UI)</h1>
          <p className="crud-subtitle">
            Explore e teste os endpoints REST da entidade <strong>Startup</strong> diretamente pelo console interativo.
          </p>
        </div>
      </div>

      <div
        style={{
          background: '#111113',
          border: '1px solid #27272a',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div ref={containerRef} />
      </div>
    </div>
  )
}

