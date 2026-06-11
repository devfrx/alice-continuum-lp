import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { clamp01, segment } from '../lib/motion'
import { onFrame } from '../lib/raf'

/**
 * Scroll timeline for a pinned (sticky) section: the container is
 * N x 100vh tall with a 100vh sticky child. Progress runs 0..1 while the
 * sticky child is pinned, and is split into `beats` discrete steps.
 * Also writes `--p` on the container element.
 */
export function usePinnedTimeline(
  el: Ref<HTMLElement | null>,
  beats: number,
): { progress: Ref<number>; beat: Ref<number>; local: Ref<number> } {
  const progress = ref(0)
  const beat = ref(0)
  const local = ref(0)
  let active = true
  let observer: IntersectionObserver | null = null
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    const target = el.value
    if (!target) return

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
      const range = rect.height - window.innerHeight
      const p = range > 0 ? clamp01(-rect.top / range) : 0
      if (Math.abs(p - progress.value) > 0.001) {
        progress.value = p
        node.style.setProperty('--p', p.toFixed(4))
        const s = segment(p, beats)
        beat.value = s.index
        local.value = s.local
      }
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    unsubscribe?.()
    unsubscribe = null
  })

  return { progress, beat, local }
}
