import investorImage from '../assets/generic_Investor.png'
import { Check, Info } from 'lucide-react'
import { SegmentIcon } from './SegmentIcon'

interface InvestorProfilePreviewProps {
  nome: string
  tipo: string
  ticketMin: number
  ticketMax: number
  segmentos: string[]
}

export function InvestorProfilePreview({ nome, tipo, ticketMin, ticketMax, segmentos }: InvestorProfilePreviewProps) {
  const nomeExibido = nome.trim() || 'Nome do investidor'
  const tipoExibido = tipo || 'Tipo de investidor não selecionado'
  const segmentosExibidos = segmentos.length > 0 ? segmentos : ['Segmentos de interesse não selecionados']

  return (
    <div className="startup-profile-preview investor-profile-preview">
      <div className="startup-profile-preview-card">
        <div className="startup-profile-preview-header">
          <div className="startup-profile-preview-logo">
            <img src={investorImage} alt="" />
          </div>
          <div>
            <h3>{nomeExibido}</h3>
            <p>{tipoExibido}</p>
          </div>
        </div>
        <div className="startup-profile-preview-metrics">
          <div><span>Ticket mínimo</span><strong>{formatarMoeda(ticketMin)}</strong></div>
          <div><span>Ticket máximo</span><strong>{formatarMoeda(ticketMax)}</strong></div>
        </div>
        <div className="investor-profile-preview-segments">
          <span>Segmentos de interesse</span>
          <div>
            {segmentosExibidos.map((segmento) => <em key={segmento}><SegmentIcon nome={segmento} />{segmento}</em>)}
          </div>
        </div>
        <div className="startup-profile-preview-actions">
          <button className="button button-success button-compact" type="button" disabled>
            <Check size={16} aria-hidden="true" />
            Aceitar proposta
          </button>
          <button className="button button-outline button-compact" type="button" disabled>
            <Info size={16} aria-hidden="true" />
            Mais detalhes
          </button>
        </div>
      </div>
      <small>Prévia do perfil exibido para startups</small>
    </div>
  )
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor)
}
