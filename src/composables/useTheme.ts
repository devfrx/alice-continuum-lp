import { onMounted, ref, watch } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'alce-theme'

const currentTheme = ref<Theme>('dark')

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}

export function useTheme() {
  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    currentTheme.value = stored ?? (prefersDark ? 'dark' : 'light')
    applyTheme(currentTheme.value)
  })

  watch(currentTheme, (next) => {
    applyTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable */
    }
  })

  function toggle(): void {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme: currentTheme, toggle }
}
