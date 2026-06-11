import { describe, it, expect } from 'vitest'
import { mulberry32, makeGraph, project } from './graph'

describe('mulberry32', () => {
  it('is deterministic for the same seed', () => {
    const a = mulberry32(123)
    const b = mulberry32(123)
    for (let i = 0; i < 20; i++) expect(a()).toBe(b())
  })

  it('produces different sequences for different seeds', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    const seqA = Array.from({ length: 5 }, () => a())
    const seqB = Array.from({ length: 5 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it('yields values in [0, 1)', () => {
    const rand = mulberry32(99)
    for (let i = 0; i < 1000; i++) {
      const v = rand()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('makeGraph', () => {
  it('is deterministic for the same seed and count', () => {
    expect(makeGraph(42, 30)).toEqual(makeGraph(42, 30))
  })

  it('differs across seeds', () => {
    expect(makeGraph(1, 30)).not.toEqual(makeGraph(2, 30))
  })

  it('creates the requested number of nodes', () => {
    expect(makeGraph(7, 50).nodes).toHaveLength(50)
  })

  it('places nodes inside the y-flattened unit ellipsoid with r in [0.5, 1]', () => {
    const g = makeGraph(7, 50)
    g.nodes.forEach((n) => {
      expect(Math.hypot(n.x, n.y / 0.62, n.z)).toBeLessThanOrEqual(1.0001)
      expect(n.r).toBeGreaterThanOrEqual(0.5)
      expect(n.r).toBeLessThanOrEqual(1)
    })
  })

  it('produces valid edges: in-range indices, a < b, no duplicates', () => {
    const g = makeGraph(7, 50)
    const seen = new Set<string>()
    g.edges.forEach((e) => {
      expect(Number.isInteger(e.a)).toBe(true)
      expect(Number.isInteger(e.b)).toBe(true)
      expect(e.a).toBeGreaterThanOrEqual(0)
      expect(e.b).toBeLessThan(50)
      expect(e.a).toBeLessThan(e.b) // also rules out self-edges
      const key = `${e.a}-${e.b}`
      expect(seen.has(key)).toBe(false)
      seen.add(key)
    })
  })

  it('gives every node at least one edge', () => {
    const g = makeGraph(13, 40)
    const degree = new Array(40).fill(0)
    g.edges.forEach((e) => {
      degree[e.a]++
      degree[e.b]++
    })
    degree.forEach((d) => expect(d).toBeGreaterThanOrEqual(1))
  })

  it('handles degenerate counts', () => {
    expect(makeGraph(7, 0)).toEqual({ nodes: [], edges: [] })
    const one = makeGraph(7, 1)
    expect(one.nodes).toHaveLength(1)
    expect(one.edges).toEqual([])
    const two = makeGraph(7, 2)
    expect(two.nodes).toHaveLength(2)
    expect(two.edges).toEqual([{ a: 0, b: 1 }])
  })
})

describe('project', () => {
  const vp = { w: 200, h: 100 }

  it('lands the origin at viewport center with scale 1', () => {
    expect(project({ x: 0, y: 0, z: 0 }, 0, 3, vp)).toEqual({ sx: 100, sy: 50, scale: 1 })
  })

  it('keeps the x sign with rotY = 0', () => {
    const right = project({ x: 0.5, y: 0, z: 0 }, 0, 3, vp)
    const left = project({ x: -0.5, y: 0, z: 0 }, 0, 3, vp)
    expect(right.sx).toBeGreaterThan(100)
    expect(left.sx).toBeLessThan(100)
    // exact: sx = w/2 + x * persp * (min(w,h) * 0.38) = 100 + 0.5 * 1 * 38
    expect(right.sx).toBeCloseTo(119, 10)
    expect(right.sy).toBeCloseTo(50, 10)
    expect(right.scale).toBeCloseTo(1, 10)
  })

  it('flips the x sign when rotated by PI', () => {
    const p = project({ x: 0.5, y: 0, z: 0 }, Math.PI, 3, vp)
    expect(p.sx).toBeCloseTo(81, 5)
    expect(p.sy).toBeCloseTo(50, 5)
  })

  it('applies perspective: near points scale up, far points scale down', () => {
    // camera on +z: z' = 1 → persp = 3 / (3 - 1) = 1.5
    expect(project({ x: 0, y: 0, z: 1 }, 0, 3, vp).scale).toBeCloseTo(1.5, 10)
    // z' = -1 → persp = 3 / 4 = 0.75
    expect(project({ x: 0, y: 0, z: -1 }, 0, 3, vp).scale).toBeCloseTo(0.75, 10)
  })

  it('rotates z into x: a point on +z swings to +x after rotY = PI/2', () => {
    // x' = x cosθ + z sinθ = 0 + 1 * 1 = 1; z' = -x sinθ + z cosθ = 0
    const p = project({ x: 0, y: 0, z: 1 }, Math.PI / 2, 3, vp)
    expect(p.sx).toBeCloseTo(100 + 1 * 1 * 38, 5)
    expect(p.scale).toBeCloseTo(1, 5)
  })

  it('projects y without rotation (y axis is the rotation axis)', () => {
    const p = project({ x: 0, y: 0.5, z: 0 }, 1.234, 3, vp)
    expect(p.sy).toBeCloseTo(50 + 0.5 * 1 * 38, 5)
  })

  it('uses the smaller viewport dimension for the projection radius', () => {
    const tall = project({ x: 1, y: 0, z: 0 }, 0, 3, { w: 100, h: 400 })
    expect(tall.sx).toBeCloseTo(50 + 1 * 1 * 38, 10)
  })
})
