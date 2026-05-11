<script setup lang="ts">
import Wordmark from './Wordmark.vue'
</script>

<template>
  <section id="overture" class="overture scene scene--full" data-scroll aria-label="AL\CE × CONT\NUUM">
    <div class="bg" aria-hidden="true">
      <img src="/brand/alice_header.png" alt="" loading="eager" decoding="async" fetchpriority="high" />
      <span class="photo-slice photo-slice-a" />
      <span class="photo-slice photo-slice-b" />
      <span class="logo-ghost logo-ghost-alce">
        <Wordmark brand="alce" />
      </span>
      <span class="logo-ghost logo-ghost-continuum">
        <Wordmark brand="continuum" />
      </span>
      <span class="type-mask type-mask-left">LOCAL</span>
      <span class="type-mask type-mask-right">OWNED</span>
      <span class="vignette" />
    </div>

    <div class="frame">
      <p class="mono mono-top">№ I · Local runtime · private notes</p>

      <h1 class="display title" aria-label="AL\CE and CONT\NUUM">
        <span class="line line-1">
          <Wordmark brand="alce" />
        </span>
        <span class="line line-2 serif-italic">&amp;</span>
        <span class="line line-3 dim">
          <Wordmark brand="continuum" />
        </span>
      </h1>

      <p class="tag">
        Private AI workspace for agents, voice, notes and memory.
        <br />
        <span class="serif-italic">No account layer. No remote memory.</span>
      </p>

      <ul class="hero-proofs" aria-label="Core promises">
        <li>Local LLM runtime</li>
        <li>Private knowledge graph</li>
        <li>Typed plugin tools</li>
      </ul>

      <p class="mono scroll-cue" aria-hidden="true">
        <span>↓</span>&nbsp; Continue
      </p>
    </div>
  </section>
</template>

<style scoped>
@property --hero-intro {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}

@property --line-intro {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

@property --layer-intro {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.overture {
  position: relative;
  isolation: isolate;
  background: var(--surface-0);
  --hero-intro: 0;
  animation: hero-intro 1.55s var(--ease-cinema) 120ms forwards;
}

@keyframes hero-intro {
  from {
    --hero-intro: 0;
  }

  to {
    --hero-intro: 1;
  }
}

@keyframes line-intro {
  from {
    --line-intro: 0;
  }

  to {
    --line-intro: 1;
  }
}

@keyframes layer-intro {
  from {
    --layer-intro: 0;
  }

  to {
    --layer-intro: 1;
  }
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/brand/alice_header.png');
  background-position: right calc(50% + (var(--p, 0) - 0.5) * -80px);
  background-repeat: no-repeat;
  background-size: auto 112%;
  filter: var(--hero-image-filter);
  mix-blend-mode: var(--hero-image-blend);
  opacity: calc(var(--hero-image-opacity) * var(--in, 0) * var(--hero-intro, 1) * 0.26);
  clip-path: inset(21% 0 47% 42%);
  transform: translateX(calc((var(--p, 0) - 0.5) * -82px + (1 - var(--hero-intro, 1)) * 56px));
  pointer-events: none;
}

.bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/brand/alice_header.png');
  background-position: right calc(50% + (var(--p, 0) - 0.5) * 120px);
  background-repeat: no-repeat;
  background-size: auto 118%;
  filter: var(--hero-image-filter);
  mix-blend-mode: var(--hero-image-blend);
  opacity: calc(var(--hero-image-opacity) * var(--in, 0) * var(--hero-intro, 1) * 0.13);
  clip-path: polygon(54% 53%, 100% 49%, 100% 85%, 60% 82%, 49% 67%);
  transform: translateX(calc((var(--p, 0) - 0.5) * 96px + (1 - var(--hero-intro, 1)) * -70px));
  pointer-events: none;
}

.bg img {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(calc((1 - var(--in, 0)) * 8% + (1 - var(--hero-intro, 1)) * 8% + (var(--p, 0) - 0.5) * -22px),
      calc(-50% + (var(--p, 0) - 0.5) * 132px + (1 - var(--hero-intro, 1)) * 34px));
  height: 110%;
  width: auto;
  max-width: 60%;
  object-fit: contain;
  object-position: right center;
  filter: var(--hero-image-filter);
  opacity: calc(var(--hero-image-opacity) * var(--in, 0) * (0.38 + var(--hero-intro, 1) * 0.62));
  mix-blend-mode: var(--hero-image-blend);
  clip-path: inset(calc((1 - var(--in, 0)) * 5%) 0 calc(var(--out, 0) * 10%) calc((1 - var(--in, 0)) * 7%));
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 15%, #000 82%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 15%, #000 82%, transparent 100%);
  transition: opacity 0.6s var(--ease-cinema);
}

.photo-slice {
  --layer-intro: 0;

  position: absolute;
  right: 0;
  top: 0;
  width: min(58vw, 880px);
  height: 100%;
  background-image: url('/brand/alice_header.png');
  background-repeat: no-repeat;
  background-size: auto 112%;
  filter: var(--hero-image-filter);
  mix-blend-mode: var(--hero-image-blend);
  pointer-events: none;
  opacity: calc(var(--layer-intro, 0) * var(--in, 0) * 0.24);
  -webkit-mask-image:
    linear-gradient(90deg, transparent 0%, #000 25%, #000 70%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, #000 18%, #000 84%, transparent 100%);
  mask-image:
    linear-gradient(90deg, transparent 0%, #000 25%, #000 70%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, #000 18%, #000 84%, transparent 100%);
  animation: layer-intro 1.25s var(--ease-cinema) 260ms forwards;
}

.photo-slice-a {
  background-position: right calc(50% + (var(--p, 0) - 0.5) * -110px);
  clip-path: polygon(20% 15%, 100% 12%, 100% 36%, 8% 42%);
  transform: translateX(calc((1 - var(--layer-intro, 0)) * 92px + (var(--p, 0) - 0.5) * -58px));
}

.photo-slice-b {
  background-position: right calc(50% + (var(--p, 0) - 0.5) * 95px);
  clip-path: polygon(32% 61%, 100% 58%, 100% 88%, 16% 84%);
  transform: translateX(calc((1 - var(--layer-intro, 0)) * -72px + (var(--p, 0) - 0.5) * 74px));
  animation-delay: 420ms;
}

.logo-ghost {
  --layer-intro: 0;

  position: absolute;
  left: var(--gutter);
  opacity: calc(var(--layer-intro, 0) * var(--in, 0) * 0.075);
  color: var(--text-primary);
  font-family: var(--font-display);
  line-height: 1;
  pointer-events: none;
  transform-origin: left center;
  animation: layer-intro 1.35s var(--ease-cinema) 360ms forwards;
}

.logo-ghost-alce {
  top: 7vh;
  font-size: clamp(5rem, 12vw, 11rem);
  transform: translateX(calc((1 - var(--layer-intro, 0)) * -96px + (var(--p, 0) - 0.5) * -88px));
}

.logo-ghost-continuum {
  right: var(--gutter);
  left: auto;
  bottom: 9vh;
  font-size: clamp(3.5rem, 7vw, 7rem);
  opacity: calc(var(--layer-intro, 0) * var(--in, 0) * 0.055);
  transform: translateX(calc((1 - var(--layer-intro, 0)) * 106px + (var(--p, 0) - 0.5) * 96px));
  animation-delay: 520ms;
}

.type-mask {
  position: absolute;
  font-family: var(--font-display);
  font-size: clamp(5rem, 11vw, 13rem);
  line-height: 0.8;
  color: var(--accent);
  opacity: calc(var(--hero-intro, 1) * var(--in, 0) * 0.08);
  white-space: nowrap;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 35%, #000 62%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 35%, #000 62%, transparent 100%);
}

.type-mask-left {
  left: calc(var(--gutter) * -0.2);
  top: 18vh;
  transform: translateX(calc((var(--p, 0) - 0.5) * -68px + (1 - var(--hero-intro, 1)) * -90px));
}

.type-mask-right {
  right: -0.2em;
  bottom: 12vh;
  transform: translateX(calc((var(--p, 0) - 0.5) * 52px + (1 - var(--hero-intro, 1)) * 80px));
}

.vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 28% 50%, var(--bg-primary) 0%, transparent 55%),
    linear-gradient(to right, var(--bg-primary) 18%, transparent 60%, var(--bg-primary) 100%),
    linear-gradient(to bottom, transparent 65%, var(--bg-primary) 100%);
}

.frame {
  position: relative;
  display: grid;
  align-content: center;
  gap: clamp(1rem, 2.2vw, 1.75rem);
  min-height: 100vh;
  padding-block: clamp(6.75rem, 15vh, 12rem);
  max-width: var(--max-w);
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.mono-top {
  margin: 0;
  opacity: calc(var(--hero-intro, 1) * var(--in, 0));
  transform: translateY(calc((1 - var(--in, 0)) * -10px + (1 - var(--hero-intro, 1)) * 18px));
  transition: opacity 0.6s var(--ease-cinema), transform 0.6s var(--ease-cinema);
}

.title {
  margin: 0;
  font-size: var(--t-mega);
  display: grid;
  gap: clamp(0.15rem, 1.2vw, 0.95rem);
  color: var(--text-primary);
}

.line {
  --line-intro: 0;
  --start-x: -88px;
  --start-y: 80px;
  --scroll-x: -92px;
  --scroll-y: -22px;

  display: block;
  line-height: 0.85;
  opacity: calc(var(--line-intro, 0) * var(--in, 0));
  transform: translate3d(calc((1 - var(--in, 0)) * -20px + (var(--p, 0) - 0.5) * var(--scroll-x) + (1 - var(--line-intro, 0)) * var(--start-x)),
      calc((1 - var(--in, 0)) * 60px + (var(--p, 0) - 0.5) * var(--scroll-y) + (1 - var(--line-intro, 0)) * var(--start-y)),
      0);
  filter: blur(calc((1 - var(--line-intro, 0)) * 14px));
  clip-path: inset(0 0 calc((1 - var(--line-intro, 0)) * 100%) 0);
  transition: opacity 0.4s var(--ease-cinema), filter 0.4s var(--ease-cinema);
  animation: line-intro 1.1s var(--ease-cinema) 240ms forwards;
  will-change: transform, opacity, filter, clip-path;
}

.line-2 {
  --start-x: 42px;
  --start-y: 48px;
  --scroll-x: 54px;
  --scroll-y: -16px;

  font-size: 0.32em;
  color: var(--text-muted);
  padding-left: clamp(1rem, 5vw, 5rem);
  animation-delay: 390ms;
}

.line-3 {
  --start-x: 54px;
  --start-y: 58px;
  --scroll-x: 42px;
  --scroll-y: 28px;

  font-size: clamp(3.35rem, 2.2rem + 5.2vw, 8.9rem);
  padding-left: clamp(0.5rem, 2vw, 2.8rem);
  animation-delay: 540ms;
}

.line-1 :deep(.wordmark) {
  --wm-gap: 0.045em;
}

.line-3 :deep(.wordmark) {
  --wm-gap: 0.058em;
}

.tag {
  margin: 0;
  max-width: 36ch;
  font-size: var(--t-lede);
  line-height: 1.4;
  color: var(--text-secondary);
  opacity: calc(var(--hero-intro, 1) * var(--in, 0));
  transform: translateY(calc((1 - var(--in, 0)) * 20px + (1 - var(--hero-intro, 1)) * 24px));
  transition: opacity 0.6s var(--ease-cinema) 240ms,
    transform 0.6s var(--ease-cinema) 240ms;
}

.hero-proofs {
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  max-width: 46rem;
  opacity: calc(var(--hero-intro, 1) * var(--in, 0));
  transform: translateY(calc((1 - var(--in, 0)) * 14px + (1 - var(--hero-intro, 1)) * 16px));
  transition: opacity 0.6s var(--ease-cinema) 340ms,
    transform 0.6s var(--ease-cinema) 340ms;
}

.hero-proofs li {
  padding: 0.42rem 0.68rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg-primary) 84%, transparent);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--t-mono);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  box-shadow: var(--shadow-soft);
}

.scroll-cue {
  position: absolute;
  bottom: 2rem;
  left: var(--gutter);
  margin: 0;
  display: inline-flex;
  align-items: center;
  opacity: calc(var(--in, 0) * (1 - var(--p, 0) * 1.6));
  animation: drift 2.4s var(--ease-cinema) infinite;
}

@keyframes drift {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(4px);
  }
}

@media (max-width: 820px) {
  .overture {
    padding-inline: 0;
  }

  .frame {
    min-height: 100svh;
    padding-block: clamp(7rem, 18vh, 9rem) clamp(4.5rem, 12vh, 6rem);
    padding-inline: clamp(1.1rem, 6vw, 1.4rem);
    width: 100%;
  }

  .title {
    font-size: clamp(4.2rem, 22vw, 6.25rem);
    max-width: 100%;
    gap: 0.08em;
  }

  .line {
    --start-x: 0px;
    --scroll-x: 0px;
    transform: translate3d(0,
        calc((1 - var(--in, 0)) * 44px + (1 - var(--line-intro, 0)) * var(--start-y)),
        0);
  }

  .line-2 {
    padding-left: 0.08em;
  }

  .line-3 {
    font-size: clamp(2.75rem, 14.8vw, 4.35rem);
    padding-left: 0;
  }

  .tag {
    max-width: 27ch;
  }

  .bg img {
    max-width: 90%;
    opacity: calc(0.45 * var(--in, 0));
  }

  .bg::before,
  .bg::after,
  .photo-slice,
  .logo-ghost,
  .type-mask {
    display: none;
  }

  .vignette {
    background:
      linear-gradient(to bottom, transparent 30%, var(--bg-primary) 75%),
      linear-gradient(to right, var(--bg-primary) 0%, transparent 50%);
  }

  .hero-proofs {
    max-width: 21rem;
  }

  .hero-proofs li {
    padding-block: 0.48rem;
    letter-spacing: 0.12em;
  }

  .scroll-cue {
    left: clamp(1.1rem, 6vw, 1.4rem);
    bottom: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .overture {
    --hero-intro: 1;
  }

  .photo-slice,
  .logo-ghost,
  .line {
    --layer-intro: 1;
    --line-intro: 1;
  }

  .line {
    filter: none;
    clip-path: none;
  }
}
</style>
