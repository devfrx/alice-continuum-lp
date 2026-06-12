<script setup lang="ts">
import { computed, ref } from 'vue'
import DiagonalStage from '../fx/DiagonalStage.vue'
import KnowledgeGraph from '../demo/KnowledgeGraph.vue'
import MicroWaveform from '../demo/MicroWaveform.vue'
import ToolCallChip from '../demo/ToolCallChip.vue'
import Sparkle from '../brand/Sparkle.vue'
import Wordmark from '../brand/Wordmark.vue'
import { useLocale } from '../../composables/useLocale'
import { usePinnedTimeline } from '../../composables/usePinnedTimeline'
import { useReducedMotion } from '../../composables/useReducedMotion'
import { remap } from '../../lib/motion'

const { t } = useLocale()
const reduced = useReducedMotion()

const section = ref<HTMLElement | null>(null)
const { progress, beat } = usePinnedTimeline(section, 6)

const effBeat = computed(() => (reduced.value ? 5 : beat.value))

// The diagonal parks at the {94,86} pose continuum picks up from,
// completing its sweep in the first stretch of the pin.
const sweep = computed(() => remap(progress.value, 0, 0.1, 0, 1))

/* ——— the run, as data ———————————————————————————————————————— */

// Audit ledger: every action of the run lands here, timed against
// global scroll progress. Code register — identical across locales.
const AUDIT = [
  { t: 0.045, ts: '00:00.4', line: 'wake.detect() → "alice"' },
  { t: 0.1, ts: '00:01.2', line: 'stt.transcribe() → 9 words' },
  { t: 0.2, ts: '00:02.0', line: 'llm.plan(local) → 3 steps' },
  { t: 0.26, ts: '00:02.4', line: 'guard.check(plan) → ok' },
  { t: 0.36, ts: '00:03.1', line: 'continuum.query("dragon") → 14 notes' },
  { t: 0.42, ts: '00:04.0', line: 'files.scan("notes/") → ok' },
  { t: 0.47, ts: '00:04.6', line: 'mcp.connect("fs") → ready' },
  { t: 0.54, ts: '00:05.2', line: 'screen.capture() → 1920×1080' },
  { t: 0.6, ts: '00:06.0', line: 'terminal.run("git add notes/") → exit 0' },
  { t: 0.71, ts: '00:07.4', line: 'verify.diff() → 3 clusters · 12 links' },
  { t: 0.8, ts: '00:08.1', line: 'memory.embed(session) → 384d' },
  { t: 0.875, ts: '00:08.8', line: 'continuum.write("dragons/") → ✓' },
] as const

const auditVisible = computed(() =>
  reduced.value ? AUDIT.slice() : AUDIT.filter((e) => progress.value >= e.t),
)

// Typed tool calls of the ACT beat (code register, locale-invariant).
const TOOLS = [
  { sig: 'continuum.query(topic: string) → Note[]', out: '14 notes', rt: 0.36 },
  { sig: 'files.scan(dir: path) → File[]', out: '14 files', rt: 0.41 },
  { sig: 'mcp.connect(server: id) → session', out: 'fs · ready', rt: 0.46 },
] as const

const TERMINAL = [
  { text: '$ alice act --local', rt: 0.55 },
  { text: '✓ model · qwen2.5-14b @ LM Studio', rt: 0.575 },
  { text: '> terminal.run("git add notes/")', rt: 0.6 },
  { text: 'exit 0 · logged', rt: 0.625 },
] as const

// Which capability card narrates each beat.
const CAP_FOR_BEAT = [1, 0, 3, 4, 2, 5] as const
const currentCap = computed(() => t.value.alice.capabilities[CAP_FOR_BEAT[effBeat.value] ?? 5]!)

// Ring phase + needle. The needle sweeps the dial as the run advances.
const RING_STATUS = ['idle', 'plan', 'act', 'act', 'verify', 'done'] as const
const ringStatus = computed(() => RING_STATUS[effBeat.value] ?? 'done')
const needleDeg = computed(() => remap(progress.value, 0.12, 0.86, 0, 330))

// The wake quote types itself in during the first beat.
const typedQuote = computed(() => {
  const q = t.value.alice.show.wakeQuote
  if (reduced.value) return q
  const n = Math.round(remap(progress.value, 0.045, 0.13, 0, q.length))
  return q.slice(0, n)
})

// The memory constellation swells toward the handoff — CONT\NUUM's
// scene opens on the same motif, so the cut reads as one move.
const memZoom = computed(() => (reduced.value ? 0.9 : 0.75 + remap(progress.value, 0.85, 1, 0, 0.45)))
</script>

<template>
  <section id="alice" ref="section" class="alice">
    <div class="sticky">
      <div class="backdrop">
        <DiagonalStage
          :from="{ topX: 55, bottomX: 45 }"
          :to="{ topX: 103, bottomX: 97 }"
          :progress="sweep"
        >
          <template #left>
            <div class="pane pane-main"></div>
          </template>
          <template #right>
            <div class="pane pane-rest"></div>
          </template>
        </DiagonalStage>
      </div>

      <header class="head">
        <p class="kicker">
          <Wordmark brand="alice" variant="mark" :height="18" decorative />
          <span>{{ t.alice.kicker }}</span>
        </p>
        <h2 class="title">{{ t.alice.title }}</h2>
        <p class="intro">{{ t.alice.intro }}</p>
      </header>

      <!-- Compact runtime tag once the head dives away. -->
      <p class="runtime-tag" aria-hidden="true">
        <Sparkle :size="9" />
        <span>AL\CE · runtime</span>
      </p>

      <!-- ——— the stage: one panel per beat ——— -->
      <div class="show">
        <!-- 0 · wake -->
        <div class="panel" style="--in: 0.005; --out: 0.16">
          <p class="panel-tag">{{ t.alice.show.listening }}</p>
          <div class="wake-row">
            <MicroWaveform class="wake-wave" />
          </div>
          <p class="wake-quote">{{ typedQuote }}<span class="caret" aria-hidden="true"></span></p>
          <code class="panel-mono">faster-whisper · local</code>
        </div>

        <!-- 1 · plan -->
        <div class="panel" style="--in: 0.17; --out: 0.325">
          <p class="panel-tag">{{ t.alice.show.planTitle }}</p>
          <ol class="plan">
            <li
              v-for="(item, i) in t.alice.show.planItems"
              :key="item"
              class="plan-item"
              :style="{ '--rt': 0.2 + i * 0.03 }"
            >
              <span class="plan-box" aria-hidden="true"></span>
              <span>{{ item }}</span>
            </li>
          </ol>
          <code class="panel-mono">llm.plan() · LM Studio · 0 cloud</code>
        </div>

        <!-- 2 · typed tools + MCP -->
        <div class="panel" style="--in: 0.335; --out: 0.495">
          <p class="panel-tag">{{ t.alice.show.toolsTitle }}</p>
          <ul class="tools">
            <li
              v-for="tool in TOOLS"
              :key="tool.sig"
              class="tool"
              :style="{ '--rt': tool.rt }"
            >
              <code class="tool-sig">{{ tool.sig }}</code>
              <span class="tool-out" :style="{ '--rt': tool.rt + 0.025 }">
                <Sparkle :size="8" />
                <span>{{ tool.out }}</span>
              </span>
            </li>
          </ul>
        </div>

        <!-- 3 · pc automation -->
        <div class="panel" style="--in: 0.505; --out: 0.66">
          <p class="panel-tag">{{ t.alice.show.autoTitle }}</p>
          <div class="auto-row">
            <div class="screen" aria-hidden="true">
              <span class="screen-bar"><i></i><i></i><i></i></span>
              <span class="cursor"></span>
              <span class="click"></span>
            </div>
            <ul class="auto-checks">
              <li
                v-for="(check, i) in t.alice.show.autoChecks"
                :key="check"
                :style="{ '--rt': 0.53 + i * 0.03 }"
              >
                {{ check }}
              </li>
            </ul>
          </div>
          <div class="terminal" aria-hidden="true">
            <p v-for="line in TERMINAL" :key="line.text" :style="{ '--rt': line.rt }">
              {{ line.text }}
            </p>
          </div>
        </div>

        <!-- 4 · verify -->
        <div class="panel" style="--in: 0.67; --out: 0.825">
          <p class="panel-tag">{{ t.alice.show.verifyTitle }}</p>
          <ul class="verify">
            <li
              v-for="(check, i) in t.alice.show.verifyChecks"
              :key="check"
              class="verify-item"
              :style="{ '--rt': 0.7 + i * 0.035 }"
            >
              <svg class="tick" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 6.5 5 9.5 10 2.5" fill="none" stroke="currentColor" stroke-width="1.6" />
              </svg>
              <span>{{ check }}</span>
            </li>
          </ul>
          <code class="panel-mono">plan → act → verify · loop closed · logged</code>
        </div>

        <!-- 5 · memory + handoff to CONT\NUUM -->
        <div class="panel panel-memory" style="--in: 0.835; --out: 1.2">
          <p class="panel-tag">{{ t.alice.show.memoryTitle }}</p>
          <div class="mem-stage">
            <KnowledgeGraph :nodes="26" :seed="5" :speed="0.07" :zoom="memZoom" />
          </div>
          <p class="mem-note">{{ t.alice.show.memoryNote }}</p>
          <ToolCallChip label='continuum.write("dragons/")' done class="mem-chip" />
        </div>
      </div>

      <!-- ——— the loop dial ——— -->
      <div class="ring" :class="`ring-${ringStatus}`" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="86" class="ring-base" pathLength="360" />
          <circle cx="100" cy="100" r="86" class="arc arc-plan" pathLength="360" />
          <circle cx="100" cy="100" r="86" class="arc arc-act" pathLength="360" />
          <circle cx="100" cy="100" r="86" class="arc arc-verify" pathLength="360" />
          <g :style="{ transform: `rotate(${needleDeg}deg)` }" class="needle-g">
            <line x1="100" y1="100" x2="100" y2="26" class="needle" />
          </g>
          <circle cx="100" cy="100" r="3" class="ring-hub" />
        </svg>
        <span class="ring-label label-plan">plan</span>
        <span class="ring-label label-act">act</span>
        <span class="ring-label label-verify">verify</span>
        <span class="ring-status">{{ ringStatus }}</span>
      </div>

      <!-- ——— capability narration ——— -->
      <Transition name="cap" mode="out-in">
        <aside :key="currentCap.title" class="capcard">
          <span class="cap-num">0{{ CAP_FOR_BEAT[effBeat] + 1 }}</span>
          <h3 class="cap-title">{{ currentCap.title }}</h3>
          <code class="cap-mono">{{ currentCap.mono }}</code>
          <p class="cap-desc">{{ currentCap.desc }}</p>
        </aside>
      </Transition>

      <!-- ——— audit trail, accumulating live ——— -->
      <div class="audit">
        <p class="audit-head">
          <span>{{ t.alice.show.auditLabel }}</span>
          <span class="audit-count">{{ auditVisible.length }} / {{ AUDIT.length }} {{ t.alice.show.actionsLabel }}</span>
        </p>
        <TransitionGroup name="log" tag="ul" class="audit-list">
          <li v-for="entry in auditVisible" :key="entry.ts" class="audit-line">
            <span class="audit-ts">{{ entry.ts }}</span>
            <code class="audit-text">{{ entry.line }}</code>
          </li>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>

<style scoped>
.alice {
  position: relative;
  /* Six beats of run anatomy — generous travel, it earns it. */
  height: 720vh;
  background: var(--bg);
}

.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  min-height: 620px;
  overflow: hidden;
}

.backdrop {
  position: absolute;
  inset: 0;
}

.pane {
  position: absolute;
  inset: 0;
}

.pane-main {
  background: var(--bg);
}

.pane-rest {
  background: var(--bg-raise);
}

/* ——— header: full at rest, dives away as the run starts ——— */

.head {
  position: absolute;
  top: clamp(60px, 9vh, 104px);
  left: var(--gutter);
  max-width: 640px;
  z-index: 3;
  opacity: clamp(0, calc((0.16 - var(--p, 0)) * 9), 1);
  transform: translateY(calc(clamp(0, calc((var(--p, 0) - 0.05) * 9), 1) * -30px));
}

.kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}

.title {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(1.7rem, 3.2vw, 2.9rem);
  line-height: 1.08;
  letter-spacing: 0.02em;
  margin-bottom: 14px;
}

.intro {
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--text-2);
  max-width: 56ch;
}

.runtime-tag {
  position: absolute;
  top: clamp(60px, 9vh, 104px);
  left: var(--gutter);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: clamp(0, calc((var(--p, 0) - 0.17) * 9), 1);
}

/* ——— stage panels ——— */

.show {
  position: absolute;
  left: var(--gutter);
  top: 22vh;
  bottom: 27vh;
  width: min(580px, 46vw);
  z-index: 2;
}

.panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  /* Scroll window: fades in at --in, out at --out. Scrub-reversible. */
  --w: min(
    clamp(0, calc((var(--p, 0) - var(--in)) * 22), 1),
    clamp(0, calc((var(--out) - var(--p, 0)) * 22), 1)
  );
  opacity: var(--w);
  transform: translateY(calc((1 - var(--w)) * 22px));
  pointer-events: none;
}

.panel-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
}

.panel-mono {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: var(--text-3);
}

/* 0 · wake */

.wake-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.wake-wave :deep(.bar) {
  width: 3px;
}

.wake-quote {
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  font-size: clamp(1.4rem, 2.4vw, 2.1rem);
  line-height: 1.2;
  letter-spacing: 0.02em;
  min-height: 2.4em;
}

.caret {
  display: inline-block;
  width: 2px;
  height: 0.95em;
  margin-left: 3px;
  vertical-align: -0.12em;
  background: var(--accent);
  animation: caret-blink 0.9s steps(1) infinite;
}

@keyframes caret-blink {
  50% {
    opacity: 0;
  }
}

/* 1 · plan */

.plan {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.plan-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 15.5px;
  line-height: 1.5;
  color: var(--text);
  --r: clamp(0, calc((var(--p, 0) - var(--rt)) * 14), 1);
  opacity: var(--r);
  transform: translateX(calc((1 - var(--r)) * 14px));
}

.plan-box {
  flex-shrink: 0;
  width: 9px;
  height: 9px;
  border: 1.5px solid var(--accent);
  background: color-mix(in srgb, var(--accent) calc(var(--r) * 100%), transparent);
  transform: translateY(0.5px);
}

/* 2 · tools */

.tools {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tool {
  display: flex;
  flex-direction: column;
  gap: 6px;
  --r: clamp(0, calc((var(--p, 0) - var(--rt)) * 14), 1);
  opacity: var(--r);
  transform: translateX(calc((1 - var(--r)) * 16px));
}

.tool-sig {
  font-family: var(--font-mono);
  font-size: 13.5px;
  letter-spacing: 0.02em;
  color: var(--text);
  padding: 9px 13px;
  border: 1px solid var(--accent-border);
  border-radius: 7px;
  background: var(--accent-dim);
  align-self: flex-start;
}

.tool-out {
  display: flex;
  align-items: center;
  gap: 7px;
  padding-left: 13px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--accent);
  opacity: clamp(0, calc((var(--p, 0) - var(--rt)) * 14), 1);
}

/* 3 · automation */

.auto-row {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.screen {
  position: relative;
  flex-shrink: 0;
  width: min(250px, 24vw);
  aspect-ratio: 16 / 10;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-raise);
  overflow: hidden;
}

.screen-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 7px;
  border-bottom: 1px solid var(--line);
}

.screen-bar i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-3);
  opacity: 0.5;
}

.cursor {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: cursor-roam 5.2s var(--ease-smooth) infinite;
}

.click {
  position: absolute;
  width: 26px;
  height: 26px;
  margin: -9.5px;
  border: 1.5px solid var(--accent);
  border-radius: 50%;
  opacity: 0;
  animation: cursor-click 5.2s var(--ease-smooth) infinite;
}

@keyframes cursor-roam {
  0%   { transform: translate(28px, 48px); }
  28%  { transform: translate(150px, 64px); }
  46%  { transform: translate(150px, 64px); }
  72%  { transform: translate(82px, 110px); }
  100% { transform: translate(28px, 48px); }
}

@keyframes cursor-click {
  0%, 27% { transform: translate(28px, 48px) scale(0.2); opacity: 0; }
  30% { transform: translate(150px, 64px) scale(0.4); opacity: 0.9; }
  44% { transform: translate(150px, 64px) scale(1); opacity: 0; }
  100% { opacity: 0; }
}

.auto-checks {
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 11px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--text-2);
}

.auto-checks li {
  --r: clamp(0, calc((var(--p, 0) - var(--rt)) * 14), 1);
  opacity: var(--r);
  transform: translateX(calc((1 - var(--r)) * 12px));
}

.terminal {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-raise);
  padding: 12px 15px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-2);
}

.terminal p {
  opacity: clamp(0, calc((var(--p, 0) - var(--rt)) * 18), 1);
}

.terminal p:first-child {
  color: var(--accent);
}

/* 4 · verify */

.verify {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.verify-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  --r: clamp(0, calc((var(--p, 0) - var(--rt)) * 14), 1);
  opacity: var(--r);
  transform: translateX(calc((1 - var(--r)) * 14px));
}

.tick {
  width: 14px;
  height: 14px;
  color: var(--accent);
  /* The check draws itself as the row reveals. */
  stroke-dasharray: 16;
  stroke-dashoffset: calc(16 - var(--r) * 16);
}

/* 5 · memory */

.panel-memory {
  gap: 12px;
}

.mem-stage {
  position: relative;
  height: clamp(190px, 30vh, 300px);
  margin: 0 -8%;
}

.mem-stage > :first-child {
  position: absolute;
  inset: 0;
}

.mem-note {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--text-2);
  max-width: 44ch;
}

.mem-chip {
  align-self: flex-start;
}

/* ——— the loop dial ——— */

.ring {
  position: absolute;
  right: calc(var(--gutter) * 0.7);
  top: 50%;
  transform: translateY(-50%);
  width: clamp(260px, 28vw, 410px);
  aspect-ratio: 1;
  z-index: 1;
  opacity: clamp(0, calc((var(--p, 0) - 0.02) * 9), 1);
}

.ring svg {
  width: 100%;
  height: 100%;
  display: block;
}

.ring-base {
  stroke: var(--line);
  stroke-width: 1;
  stroke-dasharray: 2 5;
}

.arc {
  stroke: var(--text-3);
  stroke-width: 2;
  stroke-dasharray: 104 256;
  opacity: 0.3;
  transition:
    opacity 400ms var(--ease-smooth),
    stroke 400ms var(--ease-smooth);
  transform-origin: 100px 100px;
}

.arc-plan {
  transform: rotate(-82deg);
}

.arc-act {
  transform: rotate(38deg);
}

.arc-verify {
  transform: rotate(158deg);
}

.ring-plan .arc-plan,
.ring-act .arc-act,
.ring-verify .arc-verify,
.ring-done .arc {
  stroke: var(--accent);
  opacity: 0.95;
}

.needle-g {
  transform-origin: 100px 100px;
}

.needle {
  stroke: var(--accent);
  stroke-width: 1.5;
  opacity: 0.85;
}

.ring-hub {
  fill: var(--accent);
}

.ring-label {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-3);
}

.label-plan {
  top: 2%;
  left: 50%;
  transform: translateX(-50%);
}

.label-act {
  right: -3%;
  bottom: 26%;
}

.label-verify {
  left: -7%;
  bottom: 26%;
}

.ring-plan .label-plan,
.ring-act .label-act,
.ring-verify .label-verify,
.ring-done .ring-label {
  color: var(--accent);
}

.ring-status {
  position: absolute;
  top: 58%;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
}

/* ——— capability narration ——— */

.capcard {
  position: absolute;
  right: var(--gutter);
  bottom: clamp(24px, 4.5vh, 46px);
  width: min(300px, 26vw);
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 16px 18px 18px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: clamp(0, calc((var(--p, 0) - 0.03) * 9), 1);
}

.cap-num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.cap-title {
  font-size: 15.5px;
  font-weight: 500;
}

.cap-mono {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--accent);
}

.cap-desc {
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-2);
}

.cap-enter-from,
.cap-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.cap-enter-active,
.cap-leave-active {
  transition:
    opacity 240ms var(--ease-smooth),
    transform 240ms var(--ease-smooth);
}

/* ——— audit trail ——— */

.audit {
  position: absolute;
  left: var(--gutter);
  bottom: clamp(24px, 4.5vh, 46px);
  width: min(470px, 40vw);
  z-index: 3;
  opacity: clamp(0, calc((var(--p, 0) - 0.035) * 9), 1);
}

.audit-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-3);
}

.audit-count {
  color: var(--accent);
  letter-spacing: 0.08em;
}

.audit-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 5px;
  height: 118px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 26px);
  mask-image: linear-gradient(to bottom, transparent 0, #000 26px);
}

.audit-line {
  display: flex;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.03em;
  color: var(--text-3);
}

.audit-line:last-child {
  color: var(--text);
}

.audit-line:last-child .audit-ts {
  color: var(--accent);
}

.audit-ts {
  flex-shrink: 0;
}

.audit-text {
  font-family: inherit;
}

.log-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.log-enter-active {
  transition:
    opacity 220ms var(--ease-smooth),
    transform 220ms var(--ease-smooth);
}

.log-leave-active {
  transition: opacity 140ms var(--ease-smooth);
  position: absolute;
}

.log-leave-to {
  opacity: 0;
}

.log-move {
  transition: transform 220ms var(--ease-smooth);
}

/* ——— reduced motion: the whole run at rest, fully readable ——— */

@media (prefers-reduced-motion: reduce) {
  .alice {
    height: auto;
  }

  .sticky {
    position: static;
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: clamp(90px, 14vh, 150px) 0 clamp(70px, 10vh, 120px);
  }

  .ring,
  .runtime-tag,
  .capcard,
  .caret {
    display: none;
  }

  .head {
    position: static;
    opacity: 1;
    transform: none;
    margin: 0 var(--gutter) 48px;
  }

  .show {
    position: static;
    width: auto;
    max-width: 720px;
    margin-inline: var(--gutter);
    display: flex;
    flex-direction: column;
    gap: 52px;
  }

  .panel {
    position: static;
    opacity: 1;
    transform: none;
  }

  .plan-item,
  .tool,
  .tool-out,
  .auto-checks li,
  .terminal p,
  .verify-item {
    opacity: 1;
    transform: none;
  }

  .tick {
    stroke-dashoffset: 0;
  }

  .audit {
    position: static;
    width: auto;
    max-width: 720px;
    margin: 52px var(--gutter) 0;
    opacity: 1;
  }

  .audit-list {
    height: auto;
    -webkit-mask-image: none;
    mask-image: none;
  }
}

/* ——— mobile: stage front and center, dial as a corner instrument ——— */

@media (max-width: 820px) {
  .head {
    right: var(--gutter);
    max-width: none;
  }

  .show {
    left: var(--gutter);
    right: var(--gutter);
    width: auto;
    top: 18vh;
    bottom: 32vh;
  }

  .wake-quote {
    font-size: 1.35rem;
  }

  .ring {
    width: 150px;
    right: 10px;
    top: 64px;
    transform: none;
    opacity: clamp(0, calc((var(--p, 0) - 0.17) * 9), 0.85);
  }

  .ring-label {
    display: none;
  }

  .capcard {
    display: none;
  }

  .audit {
    left: var(--gutter);
    right: var(--gutter);
    width: auto;
  }

  .audit-list {
    height: 84px;
  }

  .screen {
    width: 42vw;
  }

  .auto-row {
    flex-direction: column;
    gap: 14px;
  }

  .mem-stage {
    margin: 0;
    height: 24vh;
  }
}
</style>
