<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { useLocale } from '../../composables/useLocale'

const { theme, toggle } = useTheme()
const { t } = useLocale()

// Label describes what clicking does.
const label = computed(() =>
  theme.value === 'dark' ? t.value.a11y.themeToLight : t.value.a11y.themeToDark,
)
</script>

<template>
  <button type="button" class="theme-toggle" :aria-label="label" @click="toggle">
    <Transition name="icon" mode="out-in">
      <!-- Sun: shown on dark theme (clicking switches to light) -->
      <svg
        v-if="theme === 'dark'"
        key="sun"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3.1" />
        <path d="M8 1.2 8 2.6" />
        <path d="M8 13.4 8 14.8" />
        <path d="M1.2 8 2.6 8" />
        <path d="M13.4 8 14.8 8" />
        <path d="M3.2 3.2 4.2 4.2" />
        <path d="M11.8 11.8 12.8 12.8" />
        <path d="M12.8 3.2 11.8 4.2" />
        <path d="M4.2 11.8 3.2 12.8" />
      </svg>
      <!-- Moon: shown on light theme (clicking switches to dark) -->
      <svg
        v-else
        key="moon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M13.2 9.6 A 5.6 5.6 0 1 1 6.4 2.8 A 4.5 4.5 0 0 0 13.2 9.6 Z" />
      </svg>
    </Transition>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--text-2);
  cursor: pointer;
  transition:
    color 150ms var(--ease-smooth),
    background-color 150ms var(--ease-smooth);
}

.theme-toggle:hover {
  color: var(--text);
  background: var(--accent-dim);
}

.icon-enter-active,
.icon-leave-active {
  transition:
    opacity 150ms var(--ease-smooth),
    transform 150ms var(--ease-smooth);
}

.icon-enter-from {
  opacity: 0;
  transform: rotate(-40deg);
}

.icon-leave-to {
  opacity: 0;
  transform: rotate(40deg);
}
</style>
