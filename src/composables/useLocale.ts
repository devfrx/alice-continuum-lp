import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { copy, type Copy, type Locale } from '../content/copy'

const STORAGE_KEY = 'lp-locale'

function initialLocale(): Locale {
  if (typeof document !== 'undefined' && document.documentElement.lang === 'it') {
    return 'it'
  }
  return 'en'
}

// Module-level singleton: every caller shares the same ref.
const locale: Ref<Locale> = ref(initialLocale())

const t: ComputedRef<Copy> = computed(() => copy[locale.value])

let applied = false
function apply(): void {
  if (applied) return
  applied = true
  watch(locale, (value) => {
    document.documentElement.lang = value
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // Storage unavailable — locale still applies for the session.
    }
  })
}

export function useLocale(): {
  locale: Ref<Locale>
  t: ComputedRef<Copy>
  toggle: () => void
} {
  apply()
  return {
    locale,
    t,
    toggle: () => {
      locale.value = locale.value === 'en' ? 'it' : 'en'
    },
  }
}
