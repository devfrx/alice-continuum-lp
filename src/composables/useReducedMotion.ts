import { ref, type Ref } from 'vue'

// Module-level singleton, SSR-safe (defaults to false without a window).
const reduced: Ref<boolean> = ref(false)

let bound = false

export function useReducedMotion(): Ref<boolean> {
  if (!bound && typeof window !== 'undefined') {
    bound = true
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = mq.matches
    mq.addEventListener('change', (e) => {
      reduced.value = e.matches
    })
  }
  return reduced
}
