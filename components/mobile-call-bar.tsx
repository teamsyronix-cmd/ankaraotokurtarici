import { Phone } from 'lucide-react'
import { PHONE_SHORT, PHONE_HREF } from '@/lib/site'

export function MobileCallBar() {
  return (
    <a
      href={PHONE_HREF}
      className="animate-in slide-in-from-bottom fixed inset-x-0 bottom-0 z-50 flex duration-500 items-center justify-between gap-3 bg-accent-brand px-5 py-3.5 text-accent-brand-foreground shadow-[0_-4px_20px_rgba(0,0,0,0.15)] md:hidden"
      aria-label={`Hemen ara: ${PHONE_SHORT}`}
    >
      <span className="flex items-center gap-2.5 font-bold">
        <span className="flex size-9 items-center justify-center rounded-full bg-accent-brand-foreground/15">
          <Phone className="animate-ring size-5" aria-hidden="true" />
        </span>
        Hemen Ara
      </span>
      <span className="font-heading text-lg font-extrabold">{PHONE_SHORT}</span>
    </a>
  )
}
