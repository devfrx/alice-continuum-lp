<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { LINKS } from '../../content/links'
import Sparkle from '../brand/Sparkle.vue'
import Wordmark from '../brand/Wordmark.vue'
import LocaleToggle from './LocaleToggle.vue'
import ThemeToggle from './ThemeToggle.vue'

const { t } = useLocale()

const scrolled = ref(false)

function onScroll(): void {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const sections = computed(() => [
  { href: '#alice', label: t.value.nav.alice },
  { href: '#continuum', label: t.value.nav.continuum },
  { href: '#bridge', label: t.value.nav.bridge },
  { href: '#tenets', label: t.value.nav.principles },
])
</script>

<template>
  <header class="site-nav" :class="{ scrolled }">
    <a class="skip" href="#main">{{ t.nav.skip }}</a>

    <div class="row">
      <a class="lockup" href="#overture">
        <Wordmark brand="alice" :height="14" />
        <Sparkle :size="8" class="lockup-sep" />
        <Wordmark brand="continuum" :height="14" />
      </a>

      <nav class="sections" aria-label="Sections">
        <a v-for="section in sections" :key="section.href" class="nav-link" :href="section.href">
          {{ section.label }}
        </a>
      </nav>

      <div class="actions">
        <a class="nav-link" :href="LINKS.aliceRepo" target="_blank" rel="noopener">
          {{ t.nav.github }}
        </a>
        <LocaleToggle />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid transparent;
  transition:
    background-color 150ms var(--ease-smooth),
    border-color 150ms var(--ease-smooth);
}

.site-nav.scrolled {
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: var(--line);
}

.row {
  max-width: var(--max-w);
  margin-inline: auto;
  padding-inline: var(--gutter);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lockup {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.lockup-sep {
  color: var(--text-3);
}

.sections {
  display: flex;
  align-items: center;
  gap: 22px;
}

.nav-link {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--text-3);
  transition: color 150ms var(--ease-smooth);
}

.nav-link:hover {
  color: var(--text);
}

.actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

@media (max-width: 820px) {
  .sections {
    display: none;
  }
}

/* Skip link: visually hidden until focused */
.skip {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.skip:focus {
  top: 10px;
  left: 10px;
  z-index: 101;
  width: auto;
  height: auto;
  clip: auto;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--on-accent);
  font-family: var(--font-sans);
  font-size: 13px;
  text-decoration: none;
}
</style>
