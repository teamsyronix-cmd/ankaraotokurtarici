import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { ServiceCards } from '@/components/service-cards'
import { EmergencyCta } from '@/components/emergency-cta'
import { FleetGallery } from '@/components/fleet-gallery'
import { WhyUs } from '@/components/why-us'
import { ServiceAreas } from '@/components/service-areas'
import { Process } from '@/components/process'
import { About } from '@/components/about'
import { Faq } from '@/components/faq'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'
import { MobileCallBar } from '@/components/mobile-call-bar'
import { ScrollReveal } from '@/components/scroll-reveal'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main>
        <Hero />
        <ServiceCards />
        <EmergencyCta />
        <FleetGallery />
        <WhyUs />
        <ServiceAreas />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <MobileCallBar />
      <ScrollReveal />
    </div>
  )
}
