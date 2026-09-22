import {
  CloudCog,
  GraduationCap,
  HeartPulse,
  Landmark,
  Leaf,
  ShoppingBag,
  Sprout,
  Truck,
  Utensils,
  type LucideIcon,
} from 'lucide-react'

const iconsBySegment: Record<string, LucideIcon> = {
  Finanças: Landmark,
  Saúde: HeartPulse,
  Educação: GraduationCap,
  Agricultura: Sprout,
  Logística: Truck,
  'Energia e sustentabilidade': Leaf,
  Alimentação: Utensils,
  Varejo: ShoppingBag,
  'Governo e impacto social': Landmark,
  'Software e serviços digitais': CloudCog,
}

export function SegmentIcon({ nome }: { nome: string }) {
  const Icon = iconsBySegment[nome] ?? Landmark
  return <Icon className="segment-option-icon" size={17} strokeWidth={2} aria-hidden="true" />
}
