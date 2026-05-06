import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Per-element scroll progress driver.
 *
 * For every `[data-scroll]` element in the DOM, sets a CSS custom property
 * `--p` (clamped 0..1) representing how far the element has crossed the
 * viewport: 0 just before it enters from below, 1 just after it leaves
 * from the top. Components can then drive any visual transform purely
 * with CSS, e.g. `transform: translateY(calc((1 - var(--p)) * 40px))`.
 *
 * Cheap: uses a single rAF-throttled scroll listener.
 */
export function useScrollProgress(): void {
  let frame = 0
  let nodes: HTMLElement[] = []
  let resizeObs: ResizeObserver | null = null
  let mutationObs: MutationObserver | null = null

  function refreshNodes(): void {
    nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll]'))
  }

  function tick(): void {
    frame = 0
    const vh = window.innerHeight || 1

    for (const el of nodes) {
      const rect = el.getBoundingClientRect()
      // 0 when the top of the element is at the bottom of the viewport,
      // 1 when the bottom of the element is at the top of the viewport.
      const total = rect.height + vh
      const traveled = vh - rect.top
      const p = Math.min(1, Math.max(0, traveled / total))
      el.style.setProperty('--p', p.toFixed(4))

      // Convenience: `--in` ramps 0..1 only while the element is in view,
      // useful for enter animations.
      const enter = Math.min(1, Math.max(0, (vh - rect.top) / vh))
      const leave = Math.min(1, Math.max(0, 1 - rect.bottom / vh))
      el.style.setProperty('--in', enter.toFixed(4))
      el.style.setProperty('--out', leave.toFixed(4))
    }
  }

  function onScroll(): void {
    if (frame !== 0) return
    frame = requestAnimationFrame(tick)
  }

  onMounted(() => {
    refreshNodes()
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    if ('ResizeObserver' in window) {
      resizeObs = new ResizeObserver(onScroll)
      nodes.forEach((n) => resizeObs?.observe(n))
    }

    mutationObs = new MutationObserver(() => {
      refreshNodes()
      onScroll()
    })
    mutationObs.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    if (frame !== 0) cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    resizeObs?.disconnect()
    mutationObs?.disconnect()
  })
}
