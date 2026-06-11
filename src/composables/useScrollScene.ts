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
  let active = true
  let observer: IntersectionObserver | null = null
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    const target = el.value
    if (!target) return

    // Skip per-frame rect reads while the scene is far off-screen.
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) active = entry.isIntersecting
      },
      { rootMargin: '20% 0px' },
    )
    observer.observe(target)

    unsubscribe = onFrame(() => {
      const node = el.value
      if (!active || !node) return
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight
      const p = clamp01((vh - rect.top) / (vh + rect.height))
      if (Math.abs(p - progress.value) > 0.001) {
        progress.value = p
        node.style.setProperty('--p', p.toFixed(4))
      }
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    unsubscribe?.()
    unsubscribe = null
  })

  return progress
}
