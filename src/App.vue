<script setup lang="ts">
import SiteNav from './components/chrome/SiteNav.vue'
import SiteFooter from './components/chrome/SiteFooter.vue'
import SceneOverture from './components/scenes/SceneOverture.vue'
import SceneSession from './components/scenes/SceneSession.vue'
import SceneAlice from './components/scenes/SceneAlice.vue'
import SceneContinuum from './components/scenes/SceneContinuum.vue'
import SceneBridge from './components/scenes/SceneBridge.vue'
import SceneTenets from './components/scenes/SceneTenets.vue'
import SceneOutro from './components/scenes/SceneOutro.vue'
</script>

<template>
  <SiteNav />
  <main id="main">
    <SceneOverture />
    <SceneSession />
    <SceneAlice />
    <SceneContinuum />
    <SceneBridge />
    <SceneTenets />
    <SceneOutro />
  </main>
  <SiteFooter />
</template>
