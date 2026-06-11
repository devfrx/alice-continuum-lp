<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { makeGraph, project } from '../../lib/graph'
import { onFrame } from '../../lib/raf'
import { clamp01 } from '../../lib/motion'
import { useReducedMotion } from '../../composables/useReducedMotion'

const props = withDefaults(
  defineProps<{
    /** Total node count of the generated constellation. */
    nodes?: number
    seed?: number
    /** How many nodes (and their edges) are visible. Newly revealed nodes animate in. */
    revealed?: number
    /** Rotation speed in rad/s. */
    speed?: number
    /** Indices of nodes drawing a pulsing ring. */
    pulse?: number[]
    /**
     * Fixed accent color (hex), bypassing the theme token — for panes whose
     * background is theme-invariant (e.g. the hero's always-dark side).
     */
    accent?: string
    /** Cloud radius multiplier; >1 lets the constellation overfill its box. */
    zoom?: number
  }>(),
  {
    nodes: 80,
    seed: 7,
    revealed: undefined,
    speed: 0.05,
    pulse: () => [],
    accent: undefined,
    zoom: 1,
  },
)

const FOV = 3
const STATIC_ROT_Y = 0.6
const BORN_MS = 600
const PULSE_MS = 1600
// persp range for fov=3, z' in [-1, 1] → used to normalize depth.
const SCALE_MIN = FOV / (FOV + 1)
const SCALE_MAX = FOV / (FOV - 1)

const reducedMotion = useReducedMotion()

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const canvasOk = ref(true)

const revealedCount = computed(() => Math.min(props.revealed ?? props.nodes, props.nodes))
const graph = computed(() => makeGraph(props.seed, props.nodes))

let ctx: CanvasRenderingContext2D | null = null
let cssW = 0
let cssH = 0
let dpr = 1

let rotY = STATIC_ROT_Y
let visible = false
let stopFrame: (() => void) | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let themeObserver: MutationObserver | null = null

// Accent color cached as an rgba() prefix; alpha is appended per draw.
let accentPrefix = 'rgba(232,220,200,'

// Reveal animation: node index → bornAt timestamp (ms). -1 = pending,
// stamped with `now` on the first frame after the reveal.
const bornAt = new Map<number, number>()

// Reusable projection buffers (no per-frame allocations beyond the sort).
let px: Float64Array = new Float64Array(0)
let py: Float64Array = new Float64Array(0)
let pscale: Float64Array = new Float64Array(0)
let order: number[] = []

function ensureBuffers(n: number): void {
  if (px.length < n) {
    px = new Float64Array(n)
    py = new Float64Array(n)
    pscale = new Float64Array(n)
  }
}

function readAccent(): void {
  const raw =
    props.accent ?? getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  let r = 232
  let g = 220
  let b = 200
  if (raw.startsWith('#')) {
    const hex = raw.slice(1)
    if (hex.length === 3) {
      r = parseInt(hex[0]! + hex[0]!, 16)
      g = parseInt(hex[1]! + hex[1]!, 16)
      b = parseInt(hex[2]! + hex[2]!, 16)
    } else if (hex.length >= 6) {
      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    }
  } else {
    const m = raw.match(/(\d+)\D+(\d+)\D+(\d+)/)
    if (m) {
      r = Number(m[1])
      g = Number(m[2])
      b = Number(m[3])
    }
  }
  accentPrefix = `rgba(${r},${g},${b},`
}

function accent(alpha: number): string {
  return accentPrefix + alpha.toFixed(3) + ')'
}

/** easeOutBack — spring-ish overshoot for the reveal pop. */
function easeOutBack(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  const u = t - 1
  return 1 + c3 * u * u * u + c1 * u * u
}

function starPath(c: CanvasRenderingContext2D, cx: number, cy: number, R: number): void {
  const q = R * 0.25
  c.moveTo(cx, cy - R)
  c.quadraticCurveTo(cx + q, cy - q, cx + R, cy)
  c.quadraticCurveTo(cx + q, cy + q, cx, cy + R)
  c.quadraticCurveTo(cx - q, cy + q, cx - R, cy)
  c.quadraticCurveTo(cx - q, cy - q, cx, cy - R)
  c.closePath()
}

/**
 * Draw one frame. `now` in ms (performance.now clock). When `isStatic`
 * is true (reduced motion) reveal/pulse animations are skipped and the
 * fixed rotation is used.
 */
function render(now: number, isStatic: boolean): void {
  if (!ctx || cssW <= 0 || cssH <= 0) return
  const c = ctx
  // Clear the full backing store with the identity transform: with a
  // fractional dpr, clearing cssW×cssH in scaled space leaves a sub-pixel
  // edge strip where antialiased fragments would accumulate.
  c.setTransform(1, 0, 0, 1, 0, 0)
  c.clearRect(0, 0, c.canvas.width, c.canvas.height)
  c.setTransform(dpr, 0, 0, dpr, 0, 0)

  const g = graph.value
  const n = Math.min(revealedCount.value, g.nodes.length)
  if (n === 0) return
  ensureBuffers(n)

  const rot = isStatic ? STATIC_ROT_Y : rotY
  const vw = cssW
  const vh = cssH
  for (let i = 0; i < n; i++) {
    const node = g.nodes[i]!
    const p = project(node, rot, FOV, { w: vw, h: vh }, props.zoom)
    px[i] = p.sx
    py[i] = p.sy
    pscale[i] = p.scale
  }

  // Edges first, alpha proportional to depth (average of both endpoints).
  c.lineWidth = 1
  const edges = g.edges
  for (let e = 0; e < edges.length; e++) {
    const edge = edges[e]!
    if (edge.a >= n || edge.b >= n) continue
    const s = (pscale[edge.a]! + pscale[edge.b]!) / 2
    const norm = clamp01((s - SCALE_MIN) / (SCALE_MAX - SCALE_MIN))
    c.strokeStyle = accent(0.08 + 0.18 * norm)
    c.beginPath()
    c.moveTo(px[edge.a]!, py[edge.a]!)
    c.lineTo(px[edge.b]!, py[edge.b]!)
    c.stroke()
  }

  // Nodes back-to-front.
  order.length = 0
  for (let i = 0; i < n; i++) order.push(i)
  order.sort((a, b) => pscale[a]! - pscale[b]!)

  for (let k = 0; k < n; k++) {
    const i = order[k]!
    const node = g.nodes[i]!
    const scale = pscale[i]!
    const norm = clamp01((scale - SCALE_MIN) / (SCALE_MAX - SCALE_MIN))

    let bornScale = 1
    let flash = 0
    if (!isStatic) {
      let t0 = bornAt.get(i)
      if (t0 !== undefined) {
        if (t0 < 0) {
          t0 = now
          bornAt.set(i, now)
        }
        const t = (now - t0) / BORN_MS
        if (t < 1) {
          bornScale = easeOutBack(clamp01(t))
          flash = (1 - t) * 0.5
        } else {
          bornAt.delete(i)
        }
      }
    }

    const R = (1.5 + 2.5 * node.r) * scale * bornScale
    if (R <= 0) continue
    c.fillStyle = accent(Math.min(1, 0.45 + 0.55 * norm + flash))
    c.beginPath()
    starPath(c, px[i]!, py[i]!, R)
    c.fill()

    if (!isStatic && props.pulse.includes(i)) {
      const phase = (now % PULSE_MS) / PULSE_MS
      const ringR = 3 * R * phase
      if (ringR > 0) {
        c.strokeStyle = accent(0.5 * (1 - phase))
        c.lineWidth = 1.5
        c.beginPath()
        c.arc(px[i]!, py[i]!, ringR, 0, Math.PI * 2)
        c.stroke()
        c.lineWidth = 1
      }
    }
  }
}

function frame(dt: number, now: number): void {
  rotY += props.speed * dt
  render(now, false)
}

function renderStatic(): void {
  render(performance.now(), true)
}

function syncLoop(): void {
  const shouldRun = visible && !reducedMotion.value && canvasOk.value
  if (shouldRun && !stopFrame) {
    stopFrame = onFrame(frame)
  } else if (!shouldRun && stopFrame) {
    stopFrame()
    stopFrame = null
  }
}

// Moving the window to a monitor with a different DPI does not fire the
// ResizeObserver (CSS size is unchanged) — track it via a matchMedia query
// re-armed on every change.
let dprQuery: MediaQueryList | null = null

function onDprChange(): void {
  resize()
  armDprListener()
}

function armDprListener(): void {
  dprQuery?.removeEventListener('change', onDprChange)
  dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
  dprQuery.addEventListener('change', onDprChange)
}

function resize(): void {
  const el = root.value
  const cv = canvas.value
  if (!el || !cv) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  cssW = el.clientWidth
  cssH = el.clientHeight
  cv.width = Math.max(1, Math.round(cssW * dpr))
  cv.height = Math.max(1, Math.round(cssH * dpr))
  if (reducedMotion.value || !stopFrame) renderStatic()
}

onMounted(() => {
  const el = root.value
  const cv = canvas.value
  if (!el || !cv) return

  ctx = cv.getContext('2d')
  if (!ctx) {
    canvasOk.value = false
    return
  }

  readAccent()
  resize()

  resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(el)
  // Fallback for environments where RO callbacks are delayed/suppressed
  // (e.g. pages mounted while hidden) — a window resize re-measures.
  window.addEventListener('resize', resize, { passive: true })
  armDprListener()

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1]
      if (!entry) return
      visible = entry.isIntersecting
      syncLoop()
    },
    { rootMargin: '10%' },
  )
  intersectionObserver.observe(el)

  themeObserver = new MutationObserver(() => {
    readAccent()
    if (reducedMotion.value || !stopFrame) renderStatic()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
})

watch(reducedMotion, () => {
  syncLoop()
  if (reducedMotion.value) renderStatic()
})

watch(revealedCount, (next, prev) => {
  if (next > prev) {
    for (let i = prev; i < next; i++) bornAt.set(i, -1)
  } else {
    for (let i = next; i < prev; i++) bornAt.delete(i)
  }
  if (reducedMotion.value || !stopFrame) renderStatic()
})

watch(graph, () => {
  bornAt.clear()
  if (reducedMotion.value || !stopFrame) renderStatic()
})

watch(
  () => props.accent,
  () => {
    readAccent()
    if (reducedMotion.value || !stopFrame) renderStatic()
  },
)

onBeforeUnmount(() => {
  stopFrame?.()
  stopFrame = null
  window.removeEventListener('resize', resize)
  dprQuery?.removeEventListener('change', onDprChange)
  dprQuery = null
  resizeObserver?.disconnect()
  resizeObserver = null
  intersectionObserver?.disconnect()
  intersectionObserver = null
  themeObserver?.disconnect()
  themeObserver = null
  ctx = null
})
</script>

<template>
  <div ref="root" class="knowledge-graph" aria-hidden="true">
    <canvas v-if="canvasOk" ref="canvas"></canvas>
    <!-- Static fallback when 2D canvas is unavailable. -->
    <svg
      v-else
      class="fallback"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="var(--accent)" stroke-width="0.6" opacity="0.3">
        <line x1="48" y1="62" x2="92" y2="44" />
        <line x1="92" y1="44" x2="138" y2="58" />
        <line x1="138" y1="58" x2="162" y2="96" />
        <line x1="48" y1="62" x2="36" y2="110" />
        <line x1="36" y1="110" x2="74" y2="140" />
        <line x1="74" y1="140" x2="104" y2="116" />
        <line x1="104" y1="116" x2="138" y2="58" />
        <line x1="104" y1="116" x2="142" y2="146" />
        <line x1="142" y1="146" x2="162" y2="96" />
        <line x1="92" y1="44" x2="104" y2="116" />
        <line x1="74" y1="140" x2="60" y2="168" />
        <line x1="36" y1="110" x2="48" y2="62" />
      </g>
      <g fill="var(--accent)">
        <path d="M48 58 C49 61 51 61 52 62 C51 63 49 63 48 66 C47 63 45 63 44 62 C45 61 47 61 48 58 Z" />
        <path d="M92 39 C93.2 43 95.8 43 97 44 C95.8 45 93.2 45 92 49 C90.8 45 88.2 45 87 44 C88.2 43 90.8 43 92 39 Z" />
        <path d="M138 54 C139 57 141 57 142 58 C141 59 139 59 138 62 C137 59 135 59 134 58 C135 57 137 57 138 54 Z" />
        <path d="M162 92 C163 95 165 95 166 96 C165 97 163 97 162 100 C161 97 159 97 158 96 C159 95 161 95 162 92 Z" />
        <path d="M36 105 C37.2 109 39.8 109 41 110 C39.8 111 37.2 111 36 115 C34.8 111 32.2 111 31 110 C32.2 109 34.8 109 36 105 Z" />
        <path d="M74 136 C75 139 77 139 78 140 C77 141 75 141 74 144 C73 141 71 141 70 140 C71 139 73 139 74 136 Z" />
        <path d="M104 111 C105.2 115 107.8 115 109 116 C107.8 117 105.2 117 104 121 C102.8 117 100.2 117 99 116 C100.2 115 102.8 115 104 111 Z" />
        <path d="M142 142 C143 145 145 145 146 146 C145 147 143 147 142 150 C141 147 139 147 138 146 C139 145 141 145 142 142 Z" />
        <path d="M60 165 C61 167.5 62.5 167.5 63 168 C62.5 168.5 61 168.5 60 171 C59 168.5 57.5 168.5 57 168 C57.5 167.5 59 167.5 60 165 Z" />
        <path d="M120 78 C121 80.5 122.5 80.5 123 81 C122.5 81.5 121 81.5 120 84 C119 81.5 117.5 81.5 117 81 C117.5 80.5 119 80.5 120 78 Z" />
        <path d="M64 92 C65 94.5 66.5 94.5 67 95 C66.5 95.5 65 95.5 64 98 C63 95.5 61.5 95.5 61 95 C61.5 94.5 63 94.5 64 92 Z" />
        <path d="M128 124 C129 126.5 130.5 126.5 131 127 C130.5 127.5 129 127.5 128 130 C127 127.5 125.5 127.5 125 127 C125.5 126.5 127 126.5 128 124 Z" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.knowledge-graph {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

canvas,
.fallback {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
