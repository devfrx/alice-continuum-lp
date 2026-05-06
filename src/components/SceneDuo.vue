<script setup lang="ts">
import Wordmark from './Wordmark.vue'
</script>

<template>
    <section id="duo" class="duo scene" data-scroll aria-label="The duet">
        <p class="mono number" aria-hidden="true">№ II · Desktop pair</p>

        <p class="intro display">One runtime. <span class="serif-italic">Two surfaces.</span></p>

        <div class="twin">
            <article class="pillar pillar-l">
                <div class="badge" aria-hidden="true">
                    <span class="app-logo app-logo-alice" />
                </div>
                <h2 class="display name">
                    <Wordmark brand="alce" />
                </h2>
                <p class="kind serif-italic">Assistant surface</p>
                <ul class="trace">
                    <li>Chat</li>
                    <li>Voice</li>
                    <li>Tools</li>
                    <li>Files</li>
                </ul>
            </article>

            <span class="seam" aria-hidden="true">
                <span class="seam-line seam-line-top" />
                <span class="seam-glyph">×</span>
                <span class="seam-line seam-line-bottom" />
            </span>

            <article class="pillar pillar-r">
                <div class="badge" aria-hidden="true">
                    <span class="app-logo app-logo-cont" />
                </div>
                <h2 class="display name">
                    <Wordmark brand="continuum" />
                </h2>
                <p class="kind serif-italic">Notes surface</p>
                <ul class="trace">
                    <li>Notes</li>
                    <li>Graph</li>
                    <li>Search</li>
                    <li>Links</li>
                </ul>
            </article>
        </div>

        <p class="coda">
            Shared context, separate files. Nothing hides behind a service.
        </p>
    </section>
</template>

<style scoped>
.duo {
    background: var(--bg-primary);
    border-top: 1px solid var(--rule);
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    gap: clamp(0.9rem, 2.1vw, 1.9rem);
    align-content: center;
    min-height: 100vh;
    padding-block: clamp(4.75rem, 7vh, 6.75rem);
    padding-inline: var(--gutter);
    scroll-margin-top: 0;
}

.number {
    margin: 0;
    text-align: center;
    opacity: calc(var(--in, 0));
    transform: translateY(calc((1 - var(--in, 0)) * -8px));
    transition: opacity 0.5s var(--ease-cinema);
}

.intro {
    margin: 0 auto clamp(0.4rem, 1.2vw, 0.8rem);
    max-width: 18ch;
    text-align: center;
    font-size: clamp(2.2rem, 1.45rem + 3.1vw, 5rem);
    line-height: 1;
    color: var(--text-primary);
    opacity: calc(min(1, var(--in, 0) * 1.5));
    transform: translateY(calc((1 - min(1, var(--in, 0) * 1.5)) * 24px));
    transition: opacity 0.7s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}

.intro .serif-italic {
    color: var(--accent);
}

.twin {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(110px, 220px) minmax(0, 1fr);
    align-items: start;
    gap: clamp(1rem, 3.4vw, 3.8rem);
    max-width: 1160px;
    margin-inline: auto;
    width: 100%;
}

.pillar {
    display: grid;
    gap: 0.9rem;
    align-content: center;
    text-align: center;
    opacity: calc(min(1, var(--in, 0) * 1.4));
    transition: transform 1s var(--ease-cinema), opacity 0.8s var(--ease-cinema);
}

.pillar-l {
    transform: translateX(calc((1 - min(1, var(--in, 0) * 1.4)) * -80px));
}

.pillar-r {
    transform: translateX(calc((1 - min(1, var(--in, 0) * 1.4)) * 80px));
    transition-delay: 80ms;
}

.badge {
    justify-self: center;
    width: clamp(128px, 13.5vw, 196px);
    height: clamp(128px, 13.5vw, 196px);
    display: grid;
    place-items: center;
    position: relative;
    background:
        radial-gradient(circle at 50% 52%, var(--accent-subtle), transparent 62%);
}

.badge::before {
    content: '';
    position: absolute;
    inset: 9%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: calc(0.55 + min(1, var(--in, 0) * 1.4) * 0.45);
    transform: translateY(calc((1 - min(1, var(--in, 0) * 1.4)) * 16px)) scale(calc(0.96 + min(1, var(--in, 0) * 1.4) * 0.04));
    transition: opacity 0.7s var(--ease-cinema), transform 0.9s var(--ease-cinema);
}

.pillar-l .badge::before {
    background-image: var(--desktop-app-alice);
}

.pillar-r .badge::before {
    background-image: var(--desktop-app-continuum);
}

.app-logo {
    display: none;
}

.name {
    margin: 0;
    font-size: clamp(1.8rem, 1.1rem + 2.7vw, 4.25rem);
    color: var(--text-primary);
    line-height: 0.9;
}

.kind {
    margin: 0;
    font-size: clamp(1rem, 0.9rem + 0.4vw, 1.25rem);
    color: var(--text-muted);
}

.trace {
    list-style: none;
    margin: 0.5rem 0 0;
    padding: 0;
    display: inline-flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    font-family: var(--font-mono);
    font-size: var(--t-mono);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--text-secondary);
}

.trace li {
    padding: 0.3rem 0.65rem;
    border: 1px solid var(--border);
    border-radius: 999px;
}

.seam {
    position: relative;
    width: 100%;
    height: clamp(128px, 13.5vw, 196px);
    align-self: start;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    place-items: center;
    gap: clamp(0.5rem, 1.2vw, 1rem);
    background: transparent;
}

.seam-line {
    display: block;
    width: calc(min(1, var(--in, 0) * 1.6) * 100%);
    height: 1px;
    background: var(--accent);
    opacity: calc(min(1, var(--in, 0) * 1.6));
    transition: width 0.9s var(--ease-cinema), opacity 0.6s var(--ease-cinema);
}

.seam-glyph {
    position: relative;
    z-index: 1;
    font-family: 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-size: clamp(1.9rem, 3vw, 3rem);
    color: var(--text-primary);
    width: clamp(2.75rem, 5vw, 4.5rem);
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    background: var(--bg-primary);
    opacity: calc(min(1, var(--in, 0) * 2 - 0.4));
    transform: scale(calc(0.6 + min(1, var(--in, 0) * 2 - 0.4) * 0.4));
    transition: opacity 0.6s var(--ease-cinema), transform 0.6s var(--ease-cinema);
}

.coda {
    margin: clamp(0.25rem, 1vw, 0.75rem) auto 0;
    text-align: center;
    font-size: var(--t-lede);
    color: var(--text-secondary);
    line-height: 1.45;
    max-width: 38ch;
    opacity: calc(min(1, var(--in, 0) * 1.6 - 0.6));
    transform: translateY(calc((1 - min(1, var(--in, 0) * 1.6 - 0.6)) * 30px));
    transition: opacity 0.7s var(--ease-cinema), transform 0.7s var(--ease-cinema);
}

@media (max-width: 820px) {
    .twin {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .seam {
        display: none;
    }

    .pillar-l,
    .pillar-r {
        transform: translateY(calc((1 - var(--in, 0)) * 40px));
    }
}
</style>
