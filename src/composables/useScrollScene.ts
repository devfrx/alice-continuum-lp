import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { clamp01 } from '../lib/motion'
import { onFrame } from '../lib/raf'

/**
 * Progress (0..1) of an element's traversal through the viewport:
 * 0 when its top reaches the viewport bottom, 1 when its bottom leaves
 * at the viewport top. Also written to the element as a `--p` CSS var.
 */
export function useScrollScene(el: Ref<HTMLElement | null>): Ref<number> {
  const progress = ref(0)
  // Start false: the IO fires an initial entry before the element is visible.
  let active = false
  let observer: IntersectionObserver | null = null
  let unsubscribe: (() => void) | null = null

  function frame(): void {
    const node = el.value
    if (!node) return
    const rect = node.getBoundingClientRect()
    const vh = window.innerHeight
    const p = clamp01((vh - rect.top) / (vh + rect.height))
    if (Math.abs(p - progress.value) > 0.001) {
      progress.value = p
      node.style.setProperty('--p', p.toFixed(4))
    }
  }

  onMounted(() => {
    const target = el.value
    if (!target) return

    // Subscribe/unsubscribe from the rAF loop inside the IO callback so the
    // shared loop can idle completely when nothing is on screen.
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !active) {
            active = true
            unsubscribe = onFrame(frame)
          } else if (!entry.isIntersecting && active) {
            active = false
            unsubscribe?.()
            unsubscribe = null
          }
        }
      },
      { rootMargin: '20% 0px' },
    )
    observer.observe(target)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    unsubscribe?.()
    unsubscribe = null
    active = false
  })

  return progress
}
