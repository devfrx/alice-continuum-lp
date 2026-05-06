<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  brand: 'alce' | 'continuum'
}

const props = defineProps<Props>()
const label = computed(() => (props.brand === 'alce' ? 'AL\\CE' : 'CONT\\NUUM'))
</script>

<template>
  <span
    class="wordmark"
    :data-brand="brand"
    :aria-label="label"
    role="text"
  >
    <template v-if="brand === 'alce'">
      <span class="seg">AL</span>
      <span class="slash" aria-hidden="true">\</span>
      <span class="seg">CE</span>
    </template>
    <template v-else>
      <span class="seg">CONT</span>
      <span class="slash" aria-hidden="true">\</span>
      <span class="seg">NUUM</span>
    </template>
  </span>
</template>

<style scoped>
.wordmark {
  --wm-gap: 0.052em;
  --wm-slash-nudge: 0em;

  display: inline-flex;
  align-items: center;
  gap: var(--wm-gap);
  font-family: var(--font-display);
  font-size: 1em;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 0.82;
  text-transform: uppercase;
  color: currentColor;
  vertical-align: -0.045em;
  white-space: nowrap;
}

.wordmark[data-brand='continuum'] {
  --wm-gap: 0.06em;
}

.seg,
.slash {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1em;
  line-height: 1;
}

.slash {
  color: var(--accent);
  transform: translateY(var(--wm-slash-nudge));
  margin-inline: 0.008em 0.014em;
}
</style>
