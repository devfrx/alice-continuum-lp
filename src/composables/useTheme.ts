import { ref, type Ref } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'lp-theme'

function initialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const current = document.documentElement.dataset.theme
    if (current === 'dark' || current === 'light') return current
  }
  return 'dark'
}

// Module-level singleton: every caller shares the same ref.
const theme: Ref<Theme> = ref(initialTheme())

function applyTheme(value: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = value
  }
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage unavailable (private mode, quota) — theme still applies.
  }
}

export function useTheme(): { theme: Ref<Theme>; toggle: () => void } {
  return {
    theme,
    toggle: () => {
      const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
      theme.value = next
      applyTheme(next)
    },
  }
}
