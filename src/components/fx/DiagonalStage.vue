<script lang="ts">
/**
 * A diagonal pose: where the brand backslash crosses the container's
 * top and bottom edges, in percent of container width (0–100, values
 * outside the range push the intersection off-screen).
 */
export interface DiagonalPose {
  topX: number
  bottomX: number
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { clamp01, lerp } from '../../lib/motion'
import { useReducedMotion } from '../../composables/useReducedMotion'

const props = withDefaults(
  defineProps<{
    from: DiagonalPose
    to: DiagonalPose
    /** 0..1 interpolation between `from` and `to`. Ignored under reduced motion. */
    progress?: number
    showLine?: boolean
  }>(),
  {
    progress: 0,
    showLine: true,
  },
)

const reducedMotion = useReducedMotion()

const root = ref<HTMLElement | null>(null)
const width = ref(0)
const height = ref(0)

let observer: ResizeObserver | null = null

onMounted(() => {
  const el = root.value
  if (!el) return
  width.value = el.clientWidth
  height.value = el.clientHeight
  observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (!entry) return
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
  })
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

/** Current interpolated pose. Reduced motion snaps to the `to` pose. */
const pose = computed<DiagonalPose>(() => {
  const p = reducedMotion.value ? 1 : clamp01(props.progress)
  return {
    topX: lerp(props.from.topX, props.to.topX, p),
    bottomX: lerp(props.from.bottomX, props.to.bottomX, p),
  }
})

const rootStyle = computed(() => ({
  '--dx-top': `${pose.value.topX}%`,
  '--dx-bottom': `${pose.value.bottomX}%`,
}))

/**
 * The accent line is a 2px bar anchored at the top intersection
 * (x1, 0) with transform-origin 0 0, stretched to the segment length
 * and rotated to pass through the bottom intersection (x2, h).
 * An unrotated bar points straight down (+y); rotating by
 * -atan2(x2 - x1, h) swings it onto the (dx, dy) direction
 * (CSS rotation is clockwise-positive in screen coordinates).
 * The trailing translateX(-1px) centers the 2px bar on the boundary.
 */
const lineStyle = computed(() => {
  const w = width.value
  const h = height.value
  if (w <= 0 || h <= 0) return { display: 'none' }
  const x1 = (pose.value.topX / 100) * w
  const x2 = (pose.value.bottomX / 100) * w
  const dx = x2 - x1
  const length = Math.hypot(dx, h)
  const angle = Math.atan2(dx, h)
  return {
    height: `${length}px`,
    transform: `translate(${x1}px, 0) rotate(${-angle}rad) translateX(-1px)`,
  }
})
</script>

<template>
  <div ref="root" class="diagonal-stage" :style="rootStyle">
    <div class="plane plane-left">
      <slot name="left" />
    </div>
    <div class="plane plane-right">
      <slot name="right" />
    </div>
    <div v-if="showLine" class="line" :style="lineStyle" aria-hidden="true"></div>
    <div class="overlay">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.diagonal-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.plane {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}

.plane-left {
  clip-path: polygon(0 0, calc(var(--dx-top)) 0, calc(var(--dx-bottom)) 100%, 0 100%);
}

.plane-right {
  clip-path: polygon(calc(var(--dx-top)) 0, 100% 0, 100% 100%, calc(var(--dx-bottom)) 100%);
}

.line {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  transform-origin: 0 0;
  background: var(--accent);
  opacity: 0.9;
  will-change: transform;
}

html[data-theme='dark'] .line {
  box-shadow: 0 0 24px 0 var(--accent-dim);
}

/* Unclipped content above the planes. The wrapper stays click-through
   so it never blocks the planes; its children regain interactivity. */
.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.overlay > :deep(*) {
  pointer-events: auto;
}
</style>
