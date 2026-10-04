'use client'

import { useEffect } from 'react'

/**
 * Sayfadaki tüm [data-reveal] öğelerini tek bir
 * IntersectionObserver ile izler; görünür olduklarında data-visible,
 * giriş animasyonu bitince de data-done ekler.
 * Animasyonun kendisi globals.css içindedir.
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '[data-reveal]',
    )

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => {
        el.setAttribute('data-visible', '')
        el.setAttribute('data-done', '')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.setAttribute('data-visible', '')
          observer.unobserve(el)
          // Giriş bitince kendi hover geçişlerine dönsün
          const delay = parseInt(el.style.getPropertyValue('--delay')) || 0
          window.setTimeout(() => el.setAttribute('data-done', ''), delay + 750)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
