// Shared requestAnimationFrame scheduler. One rAF loop for the whole app,
// started lazily when the first subscriber arrives, stopped when the last
// one leaves.

export type FrameFn = (dt: number, now: number) => void

const subscribers = new Set<FrameFn>()
let rafId = 0
let running = false
let last = 0

/** Cap dt so a backgrounded tab doesn't produce a giant jump on return. */
const MAX_DT = 0.1

function tick(now: number): void {
  if (!running) return
  const dt = Math.min((now - last) / 1000, MAX_DT)
  last = now
  // Subscribers added during iteration run in the same tick (Set semantics) by design.
  for (const fn of subscribers) fn(dt, now)
  // Guard: a stop() inside a callback sets running=false; skip reschedule to avoid forking a second loop.
  if (running) rafId = window.requestAnimationFrame(tick)
}

function start(): void {
  if (running || typeof window === 'undefined') return
  running = true
  last = performance.now()
  rafId = window.requestAnimationFrame(tick)
}

function stop(): void {
  if (!running) return
  running = false
  window.cancelAnimationFrame(rafId)
}

/**
 * Subscribe to the shared frame loop. Returns an unsubscribe function.
 * dt is in seconds, capped at 0.1.
 */
export function onFrame(fn: FrameFn): () => void {
  subscribers.add(fn)
  if (subscribers.size === 1) start()
  return () => {
    subscribers.delete(fn)
    if (subscribers.size === 0) stop()
  }
}
