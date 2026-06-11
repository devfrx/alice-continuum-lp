// Pure knowledge-graph generation and 3D projection math.
// No DOM, no side effects — fully unit-tested.

export interface GraphNode {
  /** Position inside a unit ellipsoid (y flattened by 0.62). */
  x: number
  y: number
  z: number
  /** Size weight, 0.5..1. */
  r: number
}

/** Undirected edge between node indices, stored with a < b. */
export interface GraphEdge {
  a: number
  b: number
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

/**
 * Mulberry32: tiny deterministic PRNG. Returns a function yielding
 * floats in [0, 1). Same seed → same sequence.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** How much the node cloud is flattened along y (ellipsoid minor axis). */
export const Y_FLATTEN = 0.62

/**
 * Generate a deterministic constellation: `count` nodes scattered in a
 * y-flattened unit ellipsoid (radius biased outward via cbrt), each
 * connected to its 1–3 nearest neighbors. Edges are deduplicated and
 * stored with a < b; with count >= 2 every node has degree >= 1.
 */
export function makeGraph(seed: number, count: number): Graph {
  const rand = mulberry32(seed)
  const nodes: GraphNode[] = []

  for (let i = 0; i < count; i++) {
    // Uniform direction on the sphere (u = cos of polar angle), radius
    // biased outward so the shell is denser than the core.
    const u = rand() * 2 - 1
    const phi = rand() * Math.PI * 2
    const radius = Math.cbrt(rand())
    const s = Math.sqrt(1 - u * u)
    nodes.push({
      x: s * Math.cos(phi) * radius,
      y: u * radius * Y_FLATTEN,
      z: s * Math.sin(phi) * radius,
      r: 0.5 + rand() * 0.5,
    })
  }

  const edges: GraphEdge[] = []
  if (count >= 2) {
    const seen = new Set<number>()
    // Scratch arrays for the per-node nearest-neighbor scan.
    const dist: number[] = new Array(count)
    for (let i = 0; i < count; i++) {
      const k = Math.min(1 + Math.floor(rand() * 3), count - 1)
      const ni = nodes[i]!
      for (let j = 0; j < count; j++) {
        if (j === i) {
          dist[j] = Infinity
          continue
        }
        const nj = nodes[j]!
        const dx = ni.x - nj.x
        const dy = ni.y - nj.y
        const dz = ni.z - nj.z
        dist[j] = dx * dx + dy * dy + dz * dz
      }
      // Selection of the k nearest (k <= 3, so a simple repeated min scan
      // is cheaper than sorting).
      for (let picked = 0; picked < k; picked++) {
        let best = -1
        let bestD = Infinity
        for (let j = 0; j < count; j++) {
          if (dist[j]! < bestD) {
            bestD = dist[j]!
            best = j
          }
        }
        if (best < 0) break
        dist[best] = Infinity
        const a = Math.min(i, best)
        const b = Math.max(i, best)
        const key = a * count + b
        if (!seen.has(key)) {
          seen.add(key)
          edges.push({ a, b })
        }
      }
    }
  }

  return { nodes, edges }
}

export interface Projected {
  sx: number
  sy: number
  scale: number
}

/**
 * Rotate `p` around the Y axis by `rotY`, then project with a simple
 * perspective camera sitting on +z at distance `fov` (in ellipsoid
 * radii) looking at the origin. Screen radius is 38% of the smaller
 * viewport dimension, multiplied by `zoom` (default 1) for stages that
 * want the cloud to overfill its box. `scale` is the perspective factor
 * (≈0.75..1.5 for fov = 3 and z' in [-1, 1]).
 */
export function project(
  p: { x: number; y: number; z: number },
  rotY: number,
  fov: number,
  viewport: { w: number; h: number },
  zoom = 1,
): Projected {
  const cos = Math.cos(rotY)
  const sin = Math.sin(rotY)
  const xr = p.x * cos + p.z * sin
  const zr = -p.x * sin + p.z * cos
  const persp = fov / (fov - zr)
  const radius = Math.min(viewport.w, viewport.h) * 0.38 * zoom
  return {
    sx: viewport.w / 2 + xr * persp * radius,
    sy: viewport.h / 2 + p.y * persp * radius,
    scale: persp,
  }
}
