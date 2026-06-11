<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'

const props = withDefaults(
  defineProps<{
    brand: 'alice' | 'continuum'
    variant?: 'text' | 'mark'
    height?: number
    decorative?: boolean
  }>(),
  { variant: 'text', decorative: false },
)

const { theme } = useTheme()

// Asset naming is glyph color: `_light` (cream) is for the dark theme,
// `_dark` (espresso) is for the light theme.
const src = computed(() => {
  const suffix = theme.value === 'dark' ? 'light' : 'dark'
  const stem = props.variant === 'text' ? `${props.brand}_text_logo` : `${props.brand}_logo`
  return `/brand/${stem}_${suffix}.webp`
})

const resolvedHeight = computed(() => props.height ?? (props.variant === 'text' ? 18 : 24))

const alt = computed(() => {
  if (props.decorative) return ''
  return props.brand === 'alice' ? 'AL\\CE' : 'CONT\\NUUM'
})
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :height="resolvedHeight"
    :aria-hidden="decorative ? 'true' : undefined"
    draggable="false"
  />
</template>

<style scoped>
img {
  display: block;
  width: auto;
  user-select: none;
}
</style>
