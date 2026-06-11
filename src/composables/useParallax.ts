import { onMounted, onUnmounted, watch, type Ref } from 'vue'
import { damp } from '../lib/motion'
import { onFrame } from '../lib/raf'
import { useReducedMotion } from './useReducedMotion'

const LAMBDA = 6
/** Skip style writes once the delta is below this threshold. */
const CONVERGE_THRESHOLD = 0.0005

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
  // Track last written values for dirty-check.
  let lastWrittenX = NaN
  let lastWrittenY = NaN

  const onMove = (e: MouseEvent): void => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1
    targetY = (e.clientY / window.innerHeight) * 2 - 1
  }

  function attach(): void {
    if (listening) return
    window.addEventListener('mousemove', onMove, { passive: true })
    listening = true
    unsubscribe = onFrame((dt) => {
      const node = el.value
      if (!node) return
      x = damp(x, targetX, LAMBDA, dt)
      y = damp(y, targetY, LAMBDA, dt)
      const dx = Math.abs(x - targetX)
      const dy = Math.abs(y - targetY)
      const converged = dx < CONVERGE_THRESHOLD && dy < CONVERGE_THRESHOLD
      const mx = x * strength
      const my = y * strength
      // Skip the style write once converged and the last written values match.
      if (converged && mx === lastWrittenX && my === lastWrittenY) return
      node.style.setProperty('--mx', mx.toFixed(3))
      node.style.setProperty('--my', my.toFixed(3))
      lastWrittenX = mx
      lastWrittenY = my
    })
  }

  function detach(): void {
    if (listening) {
      window.removeEventListener('mousemove', onMove)
      listening = false
    }
    unsubscribe?.()
    unsubscribe = null
  }

  // Pointer-fine check is mount-time only (device capability doesn't change).
  let pointerFine = false

  onMounted(() => {
    pointerFine = window.matchMedia('(pointer: fine)').matches
    if (pointerFine && !reduced.value) attach()

    // Reactively respond if prefers-reduced-motion flips mid-session.
    watch(reduced, (isReduced) => {
      if (isReduced) {
        detach()
      } else if (pointerFine) {
        attach()
      }
    })
  })

  onUnmounted(() => {
    detach()
  })
}
