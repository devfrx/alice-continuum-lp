<script setup lang="ts">
import SiteNav from './components/SiteNav.vue'
import SceneOverture from './components/SceneOverture.vue'
import SceneDuo from './components/SceneDuo.vue'
import SceneAlice from './components/SceneAlice.vue'
import SceneContinuum from './components/SceneContinuum.vue'
import SceneBridge from './components/SceneBridge.vue'
import SceneTenets from './components/SceneTenets.vue'
import SceneOutro from './components/SceneOutro.vue'
import { useReveal } from './composables/useReveal'
import { useScrollProgress } from './composables/useScrollProgress'

useReveal()
useScrollProgress()
</script>

<template>
  <a class="skip-link" href="#alce">Skip to content</a>
  <SiteNav />
  <main>
    <SceneOverture />
    <SceneDuo />
    <SceneAlice />
    <SceneContinuum />
    <SceneBridge />
    <SceneTenets />
    <SceneOutro />
  </main>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: -10000px;
  top: auto;
  min-height: 44px;
  background: var(--accent);
  color: var(--surface-0);
  padding: 0.65rem 0.85rem;
  z-index: 1000;
}

.skip-link:focus {
  left: 1rem;
  top: 1rem;
}
</style>
