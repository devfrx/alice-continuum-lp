<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import Wordmark from './Wordmark.vue'

interface Mark {
  id: string
  num: string
  label: string
}

const marks: Mark[] = [
  { id: 'overture', num: 'I', label: 'Start' },
  { id: 'duo', num: 'II', label: 'Pair' },
  { id: 'alce', num: 'III', label: 'Assistant' },
  { id: 'continuum', num: 'IV', label: 'Workspace' },
  { id: 'bridge', num: 'V', label: 'Bridge' },
  { id: 'tenets', num: 'VI', label: 'Principles' },
  { id: 'outro', num: 'VII', label: 'Install' },
]

const active = ref<string>('overture')
const progress = ref<number>(0)
let raf = 0

function update(): void {
  raf = 0
  const doc = document.documentElement
  const total = doc.scrollHeight - window.innerHeight
  progress.value = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0

  const mid = window.innerHeight * 0.4
  let current = active.value
  for (const m of marks) {
    const el = document.getElementById(m.id)
    if (!el) continue
    const top = el.getBoundingClientRect().top
    if (top <= mid) current = m.id
  }
  active.value = current
}
function onScroll(): void {
  if (raf !== 0) return
  raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  if (raf !== 0) cancelAnimationFrame(raf)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div class="mobile-nav-scrim" :data-active-section="active" aria-hidden="true" />

  <a class="brand-corner" :data-active-section="active" href="#overture" aria-label="Back to top">
    <span class="brand-word">
      <Wordmark brand="alce" />
    </span>
    <span class="brand-cross" aria-hidden="true">×</span>
    <span class="brand-word brand-word-cont">
      <Wordmark brand="continuum" />
    </span>
  </a>

  <div class="toggle-corner" :data-active-section="active">
    <ThemeToggle />
  </div>

  <nav class="rail" aria-label="Section index">
    <ul>
      <li v-for="m in marks" :key="m.id" :data-active="active === m.id">
        <a :href="`#${m.id}`" :aria-current="active === m.id ? 'location' : undefined">
          <span class="lbl">{{ m.label }}</span>
          <span class="line" aria-hidden="true" />
          <span class="pin"><span class="num">{{ m.num }}</span></span>
        </a>
      </li>
    </ul>
  </nav>

  <div class="scroll-thread" aria-hidden="true" :style="{ '--p': progress }" />
</template>

<style scoped>
.brand-corner {
  position: fixed;
  top: 1.5rem;
  left: var(--gutter);
  z-index: 110;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0;
  color: var(--text-primary);
  font-size: clamp(0.82rem, 0.76rem + 0.28vw, 1rem);
  line-height: 1;
  opacity: 0.92;
  transition: color var(--motion-fast), opacity var(--motion-fast);
}

.mobile-nav-scrim {
  display: none;
}

.brand-corner:hover {
  color: var(--accent);
  opacity: 1;
}

.brand-word {
  display: inline-flex;
}

.brand-word-cont {
  color: var(--text-secondary);
}

.brand-cross {
  font-family: var(--font-display);
  color: var(--text-muted);
  font-size: 0.78rem;
  transform: translateY(-0.04em);
}

.toggle-corner {
  position: fixed;
  top: 1.5rem;
  right: var(--gutter);
  z-index: 110;
  transition: opacity var(--motion-fast), transform var(--motion-fast);
}

.rail {
  position: fixed;
  top: 50%;
  right: clamp(1rem, 1.8vw, 1.65rem);
  transform: translateY(-50%);
  z-index: 100;
  pointer-events: none;
}

.rail ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
  pointer-events: auto;
}

.rail a {
  display: grid;
  grid-template-columns: minmax(0, 9.5rem) 2rem 2rem;
  align-items: center;
  justify-items: end;
  gap: 0.55rem;
  padding: 0.28rem 0;
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.pin {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  transition: background var(--motion-fast), color var(--motion-fast);
}

.num {
  font-family: var(--font-display);
  font-size: 0.78rem;
  letter-spacing: 0;
  color: var(--text-muted);
  text-align: right;
  transition: color var(--motion-fast);
}

.line {
  display: block;
  width: 12px;
  height: 1px;
  background: var(--text-muted);
  transform-origin: right center;
  transition: width var(--motion-fast), background var(--motion-fast), opacity var(--motion-fast);
}

.lbl {
  opacity: 0;
  transform: translateX(0.35rem);
  transition: opacity var(--motion-fast), transform var(--motion-fast);
  white-space: nowrap;
  color: var(--text-secondary);
  pointer-events: none;
}

.rail a:hover .line,
.rail a:focus-visible .line,
.rail li[data-active='true'] .line {
  width: 28px;
  background: var(--accent);
}

.rail a:hover .lbl,
.rail a:focus-visible .lbl {
  opacity: 1;
  transform: none;
  color: var(--text-primary);
}

.rail a:hover .num,
.rail a:focus-visible .num,
.rail li[data-active='true'] .num {
  color: var(--accent);
}

.rail li[data-active='true'] .pin {
  background: var(--accent-dim);
}

.scroll-thread {
  position: fixed;
  top: 18vh;
  right: clamp(0.45rem, 0.9vw, 0.8rem);
  width: 9px;
  height: 64vh;
  pointer-events: none;
  z-index: 99;
}

.scroll-thread::before,
.scroll-thread::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  border-radius: 999px;
  transform: translateX(-50%);
}

.scroll-thread::before {
  height: 100%;
  background: var(--rule);
}

.scroll-thread::after {
  height: calc(var(--p, 0) * 100%);
  background: var(--accent);
  transition: height 60ms linear;
}

@media (max-width: 820px) {
  .mobile-nav-scrim {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 105;
    display: block;
    height: 5.8rem;
    pointer-events: none;
    background:
      linear-gradient(to bottom, var(--bg-primary) 0%, var(--bg-primary) 54%, transparent 100%);
    transition: opacity var(--motion-fast);
  }

  .rail,
  .scroll-thread {
    display: none;
  }

  .brand-corner {
    top: 1rem;
    min-height: 44px;
    padding: 0.3rem 0.72rem;
    border: 1px solid var(--border-hover);
    border-radius: 999px;
    background: color-mix(in srgb, var(--bg-primary) 88%, transparent);
    backdrop-filter: blur(16px);
  }

  .toggle-corner {
    top: 1rem;
  }

  .brand-word-cont,
  .brand-cross {
    display: none;
  }

  .mobile-nav-scrim[data-active-section='outro'],
  .brand-corner[data-active-section='outro'],
  .toggle-corner[data-active-section='outro'] {
    opacity: 0;
    pointer-events: none;
  }

  .brand-corner[data-active-section='outro'],
  .toggle-corner[data-active-section='outro'] {
    transform: translateY(-0.75rem);
  }
}
</style>
