import { describe, it, expect } from 'vitest'
import { clamp01, lerp, remap, segment, damp } from './motion'

describe('clamp01', () => {
  it('passes through in-range values', () => {
    expect(clamp01(0)).toBe(0)
    expect(clamp01(0.5)).toBe(0.5)
    expect(clamp01(1)).toBe(1)
  })

  it('clamps out-of-range values', () => {
    expect(clamp01(-1)).toBe(0)
    expect(clamp01(2)).toBe(1)
  })
})

describe('lerp', () => {
  it('interpolates linearly', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
    expect(lerp(0, 10, 0)).toBe(0)
    expect(lerp(0, 10, 1)).toBe(10)
  })

  it('extrapolates beyond t = 0..1 (no clamping)', () => {
    expect(lerp(0, 10, 2)).toBe(20)
    expect(lerp(0, 10, -1)).toBe(-10)
  })

  it('handles inverted ranges', () => {
    expect(lerp(10, 0, 0.25)).toBe(7.5)
  })
})

describe('remap', () => {
  it('maps a value from one range to another', () => {
    expect(remap(0.25, 0, 0.5, 0, 1)).toBe(0.5)
    expect(remap(0.5, 0, 1, 0, 10)).toBe(5)
  })

  it('clamps to the output range', () => {
    expect(remap(2, 0, 1, 0, 10)).toBe(10)
    expect(remap(-1, 0, 1, 5, 10)).toBe(5)
  })

  it('clamps when the output range is descending', () => {
    expect(remap(2, 0, 1, 10, 0)).toBe(0)
    expect(remap(-1, 0, 1, 10, 0)).toBe(10)
  })

  it('returns out1 for a degenerate input range', () => {
    expect(remap(0.5, 1, 1, 0, 10)).toBe(10)
  })
})

describe('segment', () => {
  it('returns the first beat at p = 0', () => {
    expect(segment(0, 4)).toEqual({ index: 0, local: 0 })
  })

  it('returns the right beat mid-scroll', () => {
    expect(segment(0.49, 4).index).toBe(1)
    expect(segment(0.49, 4).local).toBeCloseTo(0.96, 5)
  })

  it('clamps the last beat to local = 1 at p = 1', () => {
    expect(segment(1, 4)).toEqual({ index: 3, local: 1 })
  })

  it('starts each beat at local = 0', () => {
    expect(segment(0.25, 4)).toEqual({ index: 1, local: 0 })
  })

  it('clamps p outside 0..1', () => {
    expect(segment(-0.5, 4)).toEqual({ index: 0, local: 0 })
    expect(segment(1.5, 4)).toEqual({ index: 3, local: 1 })
  })

  it('guards count below 1', () => {
    expect(segment(0.5, 0)).toEqual({ index: 0, local: 0.5 })
    expect(segment(0.5, -3)).toEqual({ index: 0, local: 0.5 })
  })

  it('handles a single beat', () => {
    expect(segment(0.5, 1)).toEqual({ index: 0, local: 0.5 })
  })
})

describe('damp', () => {
  it('converges to the target with a long dt', () => {
    expect(damp(0, 10, 6, 10)).toBeCloseTo(10, 3)
  })

  it('does not move with dt = 0', () => {
    expect(damp(0, 10, 6, 0)).toBe(0)
  })

  it('is frame-rate independent: two half-steps equal one full step', () => {
    const oneStep = damp(0, 10, 4, 0.1)
    const twoSteps = damp(damp(0, 10, 4, 0.05), 10, 4, 0.05)
    expect(twoSteps).toBeCloseTo(oneStep, 10)
  })

  it('never overshoots the target', () => {
    const next = damp(0, 10, 100, 1)
    expect(next).toBeLessThanOrEqual(10)
    expect(next).toBeCloseTo(10, 5)
  })
})
