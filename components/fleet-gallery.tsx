'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { FLEET_PHOTOS } from '@/lib/site'

export function FleetGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isOpen = activeIndex !== null

  const close = useCallback(() => setActiveIndex(null), [])
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % FLEET_PHOTOS.length)),
    [],
  )
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? i : (i - 1 + FLEET_PHOTOS.length) % FLEET_PHOTOS.length,
      ),
    [],
  )

  const touchStartX = useRef<number | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const deltaX = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) next()
        else prev()
      }
      touchStartX.current = null
    },
    [next, prev],
  )

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, next, prev])

  return (
    <section id="filo" className="bg-secondary py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div data-reveal className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-wider text-accent-brand">
            Araç Filomuz
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Gerçek İşler, Gerçek Araçlar
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Ankara ve çevresinde taşıdığımız araçlardan bazı kareler. Spor
            otomobilden klasik araca, sedandan panelvana kadar her aracı özenle
            ve güvenle taşıyoruz.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {FLEET_PHOTOS.map((photo, index) => (
            <li
              key={photo.src}
              data-reveal="zoom"
              style={{ '--delay': `${(index % 4) * 80}ms` } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block aspect-3/4 w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm outline-none transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
              >
                <img
                  src={photo.src || '/placeholder.svg'}
                  alt={photo.alt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && activeIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Araç filosu fotoğraf görüntüleyici"
          className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 p-4 backdrop-blur-sm duration-200"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
          >
            <X className="size-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Önceki fotoğraf"
            className="absolute left-3 inline-flex size-11 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20 sm:left-6"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>

          <figure
            className="flex max-h-[85vh] max-w-4xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={activeIndex}
              src={FLEET_PHOTOS[activeIndex].src || '/placeholder.svg'}
              alt={FLEET_PHOTOS[activeIndex].alt}
              className="animate-in fade-in zoom-in-95 max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl duration-300"
            />
            <figcaption className="text-center text-sm text-primary-foreground/80">
              {FLEET_PHOTOS[activeIndex].alt}
              <span className="ml-2 text-primary-foreground/50">
                {activeIndex + 1} / {FLEET_PHOTOS.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Sonraki fotoğraf"
            className="absolute right-3 inline-flex size-11 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20 sm:right-6"
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  )
}
