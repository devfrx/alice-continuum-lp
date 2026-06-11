import { onMounted, onUnmounted, type Ref } from 'vue'
import { damp } from '../lib/motion'
import { onFrame } from '../lib/raf'
import { useReducedMotion } from './useReducedMotion'

const LAMBDA = 6

/**
 * Cursor parallax: writes unitless `--mx` / `--my` CSS vars (-strength..strength)
 * on the element, smoothed with exponential damping. Only active on
 * fine-pointer devices without reduced motion; otherwise a no-op.
 */
export function useParallax(el: Ref<HTMLElement | null>, strength = 1): void {
  const reduced = useReducedMotion()
  let unsubscribe: (() => void) | null = null
  let listening = false

  let targetX = 0
  let targetY = 0
  let x = 0
  let y = 0

  const onMove = (e: MouseEvent): void => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1
    targetY = (e.clientY / window.innerHeight) * 2 - 1
  }

  onMounted(() => {
    if (reduced.value || !window.matchMedia('(pointer: fine)').matches) return

    window.addEventListener('mousemove', onMove, { passive: true })
    listening = true

    unsubscribe = onFrame((dt) => {
      const node = el.value
      if (!node) return
      x = damp(x, targetX, LAMBDA, dt)
      y = damp(y, targetY, LAMBDA, dt)
      node.style.setProperty('--mx', (x * strength).toFixed(3))
      node.style.setProperty('--my', (y * strength).toFixed(3))
    })
  })

  onUnmounted(() => {
    if (listening) {
      window.removeEventListener('mousemove', onMove)
      listening = false
    }
    unsubscribe?.()
    unsubscribe = null
  })
}
