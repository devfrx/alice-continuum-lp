import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Lazily reveals every element marked with `.reveal` once it enters the
 * viewport. Safe with prefers-reduced-motion (the CSS already neutralises
 * the transform so nothing else is needed here).
 */
export function useReveal(): void {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    document.querySelectorAll('.reveal').forEach((el) => observer?.observe(el))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}
