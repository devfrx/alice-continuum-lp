<script setup lang="ts">
import { computed, ref } from 'vue'
import DiagonalStage from '../fx/DiagonalStage.vue'
import KnowledgeGraph from '../demo/KnowledgeGraph.vue'
import ChatStream from '../demo/ChatStream.vue'
import Sparkle from '../brand/Sparkle.vue'
import { useLocale } from '../../composables/useLocale'
import { usePinnedTimeline } from '../../composables/usePinnedTimeline'
import { useReducedMotion } from '../../composables/useReducedMotion'

const { t } = useLocale()
const reduced = useReducedMotion()

const section = ref<HTMLElement | null>(null)
const { beat, local } = usePinnedTimeline(section, 4)

// Reduced motion renders the whole story at rest.
const effBeat = computed(() => (reduced.value ? 3 : beat.value))
const effLocal = computed(() => (reduced.value ? 1 : local.value))

/**
 * Graph choreography per beat: 14 loose notes, then reading, then +3
 * written nodes, then recall. Pulse marks the cited sources in beat 4.
 */
const GRAPH_NODES = 17
const REVEALED = [14, 14, 17, 17] as const
const revealed = computed(() => REVEALED[effBeat.value] ?? GRAPH_NODES)
const pulse = computed(() =>
  effBeat.value === 3 && effLocal.value > 0.35 ? [2, 9] : [],
)

const currentBeat = computed(() => t.value.session.beats[effBeat.value] ?? t.value.session.beats[0])
</script>

<template>
  <section id="session" ref="section" class="session">
    <div class="sticky">
      <DiagonalStage :from="{ topX: 55, bottomX: 45 }" :to="{ topX: 55, bottomX: 45 }">
        <template #left>
          <div class="pane pane-chat"></div>
        </template>
        <template #right>
          <div class="pane pane-graph"></div>
        </template>
      </DiagonalStage>

      <header class="head">
        <p class="kicker">{{ t.session.kicker }}</p>
        <h2 class="title">{{ t.session.title }}</h2>
        <p class="intro">{{ t.session.intro }}</p>
      </header>

      <div class="rail" aria-hidden="true">
        <div
          v-for="i in 4"
          :key="i"
          class="tick"
          :class="{ active: i - 1 === effBeat, passed: i - 1 < effBeat }"
        >
          <Sparkle v-if="i - 1 === effBeat" :size="10" class="tick-star" />
          <span v-else class="tick-dot"></span>
          <span class="tick-num">0{{ i }}</span>
        </div>
      </div>

      <div class="chat">
        <ChatStream :beats="t.session.beats" :beat="effBeat" :local="effLocal" />
      </div>

      <div class="graph">
        <KnowledgeGraph
          :nodes="GRAPH_NODES"
          :seed="11"
          :speed="0.04"
          :revealed="revealed"
          :pulse="pulse"
        />
        <p class="graph-label">
          <Sparkle :size="9" />
          <span>{{ currentBeat.graphLabel }}</span>
        </p>
      </div>

      <Transition name="caption" mode="out-in">
        <p :key="effBeat" class="caption">{{ currentBeat.caption }}</p>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.session {
  position: relative;
  /* 4 beats + breathing room; the sticky child stays a full viewport. */
  height: 500vh;
}

.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  min-height: 640px;
  overflow: hidden;
  background: var(--bg);
}

.pane {
  position: absolute;
  inset: 0;
}

.pane-chat {
  background: var(--bg-raise);
}

.pane-graph {
  background: var(--bg);
}

/* ——— header ——— */

.head {
  position: absolute;
  top: clamp(68px, 10vh, 110px);
  left: var(--gutter);
  max-width: 520px;
  z-index: 2;
}

.kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

.title {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(1.5rem, 2.6vw, 2.4rem);
  line-height: 1.1;
  letter-spacing: 0.02em;
  margin-bottom: 10px;
}

.intro {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--text-2);
  max-width: 44ch;
}

/* ——— beat rail ——— */

.rail {
  position: absolute;
  left: calc(var(--gutter) / 2 - 10px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 26px;
  z-index: 2;
}

.tick {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-3);
  transition: color 300ms var(--ease-smooth);
}

.tick.active {
  color: var(--accent);
}

.tick.passed {
  color: var(--text-2);
}

.tick-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}

.tick-star {
  margin: -2px 0;
}

.tick-num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
}

/* ——— chat / graph zones ——— */

.chat {
  position: absolute;
  left: var(--gutter);
  top: clamp(280px, 36vh, 380px);
  bottom: clamp(96px, 16vh, 150px);
  width: min(440px, 36vw);
  z-index: 2;
  /* Newest beats stay anchored at the bottom; older ones slide out
     through a soft fade at the top of the window. */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 56px);
  mask-image: linear-gradient(to bottom, transparent 0, #000 56px);
}

.graph {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 52%;
  z-index: 1;
}

.graph > :first-child {
  position: absolute;
  inset: 8% 0;
}

.graph-label {
  position: absolute;
  right: var(--gutter);
  bottom: clamp(96px, 16vh, 150px);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--accent);
}

/* ——— caption ——— */

.caption {
  position: absolute;
  bottom: clamp(30px, 6vh, 54px);
  left: var(--gutter);
  max-width: 520px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.55;
  letter-spacing: 0.04em;
  color: var(--text-2);
  z-index: 2;
}

.caption-enter-from,
.caption-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.caption-enter-active,
.caption-leave-active {
  transition:
    opacity 260ms var(--ease-smooth),
    transform 260ms var(--ease-smooth);
}

/* ——— reduced motion: unpinned, fully readable ——— */

@media (prefers-reduced-motion: reduce) {
  .session {
    height: auto;
  }

  .sticky {
    position: static;
    height: auto;
    min-height: 0;
    padding: 80px 0;
  }

  .head,
  .chat,
  .graph,
  .graph-label,
  .caption {
    position: static;
    width: auto;
    max-width: 640px;
    margin: 0 auto 32px;
    padding-inline: var(--gutter);
  }

  .rail {
    display: none;
  }

  .chat {
    display: block;
    overflow: visible;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .graph {
    height: 320px;
    position: relative;
    margin-bottom: 8px;
  }
}

/* ——— mobile: single column, graph above chat ——— */

@media (max-width: 820px) {
  .head {
    left: var(--gutter);
    right: var(--gutter);
    top: 76px;
    max-width: none;
  }

  .rail {
    left: auto;
    right: 12px;
    gap: 18px;
  }

  .graph {
    top: clamp(190px, 30vh, 260px);
    left: 0;
    right: 0;
    bottom: auto;
    width: auto;
    height: 26vh;
  }

  .graph > :first-child {
    inset: 0;
  }

  .graph-label {
    position: static;
    justify-content: center;
    margin-top: 4px;
  }

  .chat {
    left: var(--gutter);
    right: var(--gutter);
    width: auto;
    top: clamp(330px, 48vh, 430px);
    bottom: clamp(76px, 12vh, 110px);
  }

  .caption {
    bottom: 22px;
    right: var(--gutter);
    font-size: 11.5px;
  }
}
</style>
