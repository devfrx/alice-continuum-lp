<script setup lang="ts">
import { computed } from 'vue'
import ToolCallChip from './ToolCallChip.vue'
import type { Copy } from '../../content/copy'

type SessionBeat = Copy['session']['beats'][number]

const props = defineProps<{
  beats: readonly SessionBeat[]
  /** Current beat index (0-based). Everything up to it is rendered. */
  beat: number
  /** 0..1 progress inside the current beat — drives typing and chip reveals. */
  local: number
}>()

/**
 * The stream is a pure function of (beat, local) so scroll scrubbing is
 * fully reversible: each beat owns its visibility thresholds.
 */
const visibleBeats = computed(() => props.beats.slice(0, props.beat + 1))

function isCurrent(i: number): boolean {
  return i === props.beat
}

/** Tool chips stagger in during the owning beat. */
function chipVisible(i: number, chipIndex: number): boolean {
  if (!isCurrent(i)) return true
  return props.local > 0.3 + chipIndex * 0.18
}

function chipDone(i: number, chipIndex: number): boolean {
  if (!isCurrent(i)) return true
  return props.local > 0.52 + chipIndex * 0.18
}

/** The assistant caret blinks while the current beat is still "typing". */
function typing(i: number): boolean {
  return isCurrent(i) && props.local < 0.6
}
</script>

<template>
  <div class="stream">
    <TransitionGroup name="msg">
      <div
        v-for="(b, i) in visibleBeats"
        :key="i"
        class="beat"
        :class="{ past: !isCurrent(i) }"
      >
        <p v-if="b.user" class="bubble-user">{{ b.user }}</p>
        <p v-if="b.alice" class="line-alice">
          <span>{{ b.alice }}</span>
          <span v-if="typing(i)" class="caret" aria-hidden="true">▌</span>
        </p>
        <div v-if="b.tools.length" class="tools">
          <ToolCallChip
            v-for="(tool, k) in b.tools"
            :key="tool"
            :label="tool"
            :done="chipDone(i, k)"
            class="tool"
            :class="{ hidden: !chipVisible(i, k) }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.stream {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.beat {
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition:
    opacity 420ms var(--ease-smooth),
    transform 420ms var(--ease-smooth);
}

.beat.past {
  opacity: 0.55;
  transform: scale(0.985);
  transform-origin: left top;
}

.bubble-user {
  align-self: flex-end;
  max-width: 85%;
  padding: 10px 16px;
  border-radius: 14px 14px 4px 14px;
  background: var(--surface-2);
  color: var(--text);
  font-size: 14.5px;
  line-height: 1.5;
}

.line-alice {
  color: var(--text-2);
  font-size: 14.5px;
  line-height: 1.62;
  max-width: 95%;
}

.caret {
  color: var(--accent);
  animation: caret-blink 0.85s steps(2) infinite;
  margin-left: 2px;
}

@keyframes caret-blink {
  to {
    opacity: 0;
  }
}

.tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tool {
  transition:
    opacity 320ms var(--ease-spring),
    transform 320ms var(--ease-spring);
}

.tool.hidden {
  opacity: 0;
  transform: translateY(6px) scale(0.95);
  pointer-events: none;
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(18px);
}

.msg-enter-active {
  transition:
    opacity 480ms var(--ease-out-expo),
    transform 480ms var(--ease-out-expo);
}

.msg-leave-active {
  transition:
    opacity 200ms var(--ease-smooth),
    transform 200ms var(--ease-smooth);
}

.msg-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (prefers-reduced-motion: reduce) {
  .beat,
  .tool,
  .msg-enter-active,
  .msg-leave-active {
    transition: none;
  }
  .caret {
    animation: none;
  }
  .beat.past {
    transform: none;
  }
}
</style>
