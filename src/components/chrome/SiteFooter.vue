<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'
import Sparkle from '../brand/Sparkle.vue'

const { t } = useLocale()
</script>

<template>
  <footer class="site-footer">
    <div class="row">
      <span class="note">{{ t.footer.line }}</span>
      <Sparkle :size="8" class="divider" />
      <span class="note">{{ t.footer.madeWith }}</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--line);
}

.row {
  max-width: var(--max-w);
  margin-inline: auto;
  padding-inline: var(--gutter);
  padding-block: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.note {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-3);
}

.divider {
  color: var(--text-3);
}

@media (max-width: 640px) {
  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .divider {
    display: none;
  }
}
</style>
