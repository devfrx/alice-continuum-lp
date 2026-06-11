// Pure motion math. No DOM, no side effects — fully unit-tested.

/** Clamp a value to the 0..1 range. */
export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

/** Linear interpolation between a and b. Does NOT clamp t. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Map v from [in0, in1] to [out0, out1], clamping the result to the
 * output range. A degenerate input range (in0 === in1) returns out1.
 */
export function remap(v: number, in0: number, in1: number, out0: number, out1: number): number {
  if (in0 === in1) return out1
  const t = clamp01((v - in0) / (in1 - in0))
  return lerp(out0, out1, t)
}

/**
 * Split 0..1 progress into `count` equal beats.
 * Returns the beat index and the 0..1 progress within that beat.
 * At p = 1 the last beat is returned with local = 1.
 */
export function segment(p: number, count: number): { index: number; local: number } {
  const n = Math.max(1, Math.floor(count))
  const clamped = clamp01(p)
  const index = Math.min(n - 1, Math.floor(clamped * n))
  return { index, local: clamped * n - index }
}

/**
 * Frame-rate-independent exponential smoothing toward a target.
 * lambda is the responsiveness (higher = snappier), dt in seconds.
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt))
}
