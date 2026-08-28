import { HeroSection } from './HeroSection'
import { HowItWorksSection } from './HowItWorksSection'
import { BenefitsSection } from './BenefitsSection'
import { FeaturedOpportunities } from './FeaturedOpportunities'
import { CtaBanner } from './CtaBanner'

export function LandingPage() {
  return (
    <div className="landing-wrapper">
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <FeaturedOpportunities />
      <CtaBanner />
    </div>
  )
}
