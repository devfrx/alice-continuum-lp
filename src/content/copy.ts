// Bilingual copy dictionary. English is the source of truth; the Copy
// interface (with tuple-typed arrays) forces both locales to keep the
// exact same shape and the exact same counts.

export type Locale = 'en' | 'it'

interface SessionBeat {
  /** What the user says in this beat, or null if they stay quiet. */
  user: string | null
  /** What AL\CE says in this beat, or null if it has nothing to add. */
  alice: string | null
  /** Tool-call chip labels. Code, not prose — identical across locales. */
  tools: string[]
  /** Mono caption under the graph, e.g. '+3 nodes · sources attached'. */
  graphLabel: string
  /** One-line narration of the beat. */
  caption: string
}

interface AliceCapability {
  title: string
  /** Terse technical line, e.g. 'wake word · STT · TTS'. */
  mono: string
  desc: string
}

interface ContinuumCapability {
  title: string
  mono: string
}

interface TenetSeal {
  /** Mono, uppercase register, e.g. 'CLOUD CALLS'. */
  label: string
  /** Short value, e.g. '0'. */
  value: string
  /** The dry line. */
  note: string
}

interface OutroCta {
  name: string
  tagline: string
  action: string
}

export interface Copy {
  nav: {
    alice: string
    continuum: string
    bridge: string
    principles: string
    github: string
    ariaTheme: string
    ariaLocale: string
    skip: string
  }
  hero: {
    eyebrow: string
    titleA: string
    /** Second display line — the accent line. */
    titleB: string
    sub: string
    ctaPrimary: string
    ctaSecondary: string
    scrollHint: string
    /** Tiny mono caption for the ivory pane. */
    paneAlice: string
    /** Tiny mono caption for the dark pane. */
    paneContinuum: string
  }
  session: {
    kicker: string
    title: string
    intro: string
    beats: [SessionBeat, SessionBeat, SessionBeat, SessionBeat]
  }
  alice: {
    kicker: string
    title: string
    intro: string
    capabilities: [
      AliceCapability,
      AliceCapability,
      AliceCapability,
      AliceCapability,
      AliceCapability,
      AliceCapability,
    ]
  }
  continuum: {
    kicker: string
    title: string
    intro: string
    capabilities: [
      ContinuumCapability,
      ContinuumCapability,
      ContinuumCapability,
      ContinuumCapability,
      ContinuumCapability,
    ]
    fileNote: string
    /** Instrument readouts shown while the camera dives into the graph. */
    hud: { depth: string; range: string; lock: string }
    /** Scroll affordance shown before the dive begins. */
    diveHint: string
  }
  bridge: {
    kicker: string
    title: string
    intro: string
    labelTop: string
    labelBottom: string
    /** The handshake across the seam: one request, one response. */
    ask: { label: string; mono: string }
    reply: { label: string; mono: string }
    clausesTitle: string
    channels: [string, string, string, string, string]
  }
  tenets: {
    kicker: string
    title: string
    /** Case-file header line, e.g. 'FILE № AC-066 · CLASSIFICATION: PUBLIC'. */
    docId: string
    /** Case-file footer line, e.g. 'rev 2026.06 · nothing redacted'. */
    docFoot: string
    seals: [TenetSeal, TenetSeal, TenetSeal, TenetSeal, TenetSeal, TenetSeal]
    stamp: string
  }
  outro: {
    title: string
    sub: string
    /** Pre-release explanation — installers arrive here. */
    note: string
    ctaAlice: OutroCta
    ctaContinuum: OutroCta
  }
  footer: {
    line: string
    madeWith: string
  }
  a11y: {
    themeToDark: string
    themeToLight: string
    portraitAlt: string
    graphAria: string
    diagonalAria: string
  }
}

const en: Copy = {
  nav: {
    alice: 'AL\\CE',
    continuum: 'CONT\\NUUM',
    bridge: 'Bridge',
    principles: 'Principles',
    github: 'GitHub',
    ariaTheme: 'Toggle color theme',
    ariaLocale: 'Switch language',
    skip: 'Skip to content',
  },

  hero: {
    eyebrow: 'Pre-release · Windows-first · 100% local',
    titleA: 'One mind.',
    titleB: 'Two halves.',
    sub: 'A private AI workspace that runs on your machine and answers to no one. AL\\CE acts. CONT\\NUUM remembers.',
    ctaPrimary: 'Star AL\\CE on GitHub',
    ctaSecondary: 'Star CONT\\NUUM',
    scrollHint: 'Scroll to watch them work',
    paneAlice: 'AL\\CE · model · tools · state',
    paneContinuum: 'CONT\\NUUM · files · links · vectors',
  },

  session: {
    kicker: 'One session',
    title: 'From scattered notes to cited answers.',
    intro: 'One exchange, four beats. No cloud round-trips, no hidden steps. This is the whole trick.',
    beats: [
      {
        user: 'My notes on the dragon project are everywhere. Organize them.',
        alice: null,
        tools: [],
        graphLabel: '14 loose notes · 0 links',
        caption: 'You ask. In plain words, like you would ask a person.',
      },
      {
        user: null,
        alice: 'Plan: find every note that mentions dragons, check the rest of the lore, then file properly.',
        tools: ['continuum.query("dragon")', 'files.scan("notes/")'],
        graphLabel: 'reading 14 notes · 2 tool calls',
        caption: 'AL\\CE plans, then calls tools. The loop is explicit — every step lands in the log.',
      },
      {
        user: null,
        alice: 'Three clusters: anatomy, factions, timeline. Writing them now, sources attached.',
        tools: ['continuum.write("dragons/anatomy")', 'notes.link(12)'],
        graphLabel: '+3 nodes · 12 links · sources attached',
        caption: 'CONT\\NUUM takes the write. New nodes, real files, every source cited.',
      },
      {
        user: 'Wait — which faction rides the frost dragons?',
        alice: 'The Veil March. Source: dragons/factions, linked from your March 12 note.',
        tools: ['continuum.query("frost dragon riders")'],
        graphLabel: '1 query · answer from 2 nodes',
        caption: 'Days later. Nothing to re-explain — the graph remembers so you don\'t have to.',
      },
    ],
  },

  alice: {
    kicker: 'AL\\CE',
    title: 'An assistant that acts — and shows its work.',
    intro: 'A local agent on your PC. It plans, acts, verifies, and writes every step down. No accounts, no telemetry, no one reading over your shoulder.',
    capabilities: [
      {
        title: 'Local runtime',
        mono: 'LM Studio · Ollama',
        desc: 'The model runs on your hardware. Unplug the router; AL\\CE won\'t notice.',
      },
      {
        title: 'Voice',
        mono: 'wake word · STT · TTS',
        desc: 'faster-whisper in, Piper or Kokoro out. The microphone listens to you, not for someone else.',
      },
      {
        title: 'Explicit agent loop',
        mono: 'plan → act → verify',
        desc: 'Every action is a typed tool call you can read. No improvising off the record.',
      },
      {
        title: 'Tools and MCP',
        mono: 'typed plugins · native MCP client',
        desc: 'Plugin tools with declared inputs and outputs. MCP servers connect without ceremony.',
      },
      {
        title: 'PC automation',
        mono: 'screenshots · input · terminal',
        desc: 'It sees the screen, moves the cursor, runs commands. Calendar and email included.',
      },
      {
        title: 'Memory and audit',
        mono: 'episodic memory · local vectors · audit trail',
        desc: 'It remembers on a local vector store, and every action lands in the log. Both readable by you.',
      },
    ],
  },

  continuum: {
    kicker: 'CONT\\NUUM',
    title: 'Notes an AI can query. Files you can read.',
    intro: 'Markdown notes, a knowledge graph, semantic search on local embeddings. Built for worldbuilding, lore, and the documentation only you care about.',
    capabilities: [
      { title: 'Notes', mono: 'markdown · WYSIWYG' },
      { title: 'Graph', mono: 'backlinks · knowledge graph' },
      { title: 'Search', mono: 'local embeddings · pgvector' },
      { title: 'Structure', mono: 'folders · inheritance · templates' },
      { title: 'Files', mono: 'plain on disk · readable anywhere' },
    ],
    fileNote: 'Open notes/dragon.md in any editor. It is exactly what it looks like. Plain by design.',
    hud: { depth: 'depth', range: 'nodes in range', lock: 'node locked' },
    diveHint: 'scroll · enter the graph',
  },

  bridge: {
    kicker: 'The bridge',
    title: 'A contract, not a service.',
    intro: 'AL\\CE queries. CONT\\NUUM stores. They talk over a local contract — request context, return sources, write artifacts. Shared context, separate files. Nothing hides behind a service.',
    labelTop: 'AL\\CE · queries',
    labelBottom: 'CONT\\NUUM · stores',
    ask: { label: 'AL\\CE · asks', mono: 'ctx.request("dragon · timeline")' },
    reply: { label: 'CONT\\NUUM · answers', mono: '→ 3 sources · notes/dragon.md' },
    clausesTitle: 'Clauses',
    channels: ['shared index', 'knowledge API', 'RAG context', 'event bus', 'artifacts'],
  },

  tenets: {
    kicker: 'Dossier',
    title: 'Plain by design.',
    docId: 'FILE NO. AC-066 · CLASSIFICATION: PUBLIC',
    docFoot: 'rev 2026.06 · nothing redacted',
    seals: [
      { label: 'CLOUD CALLS', value: '0', note: 'We counted twice.' },
      { label: 'ACCOUNTS REQUIRED', value: '0', note: 'You already own the machine.' },
      { label: 'TELEMETRY', value: 'none', note: 'Nothing phones home. There is no home to phone.' },
      { label: 'FILE FORMAT', value: 'plain', note: 'Markdown on disk. Readable in thirty years, or in Notepad.' },
      { label: 'AUDIT TRAIL', value: 'full', note: 'Every action logged. Including the embarrassing ones.' },
      { label: 'EXIT COST', value: '0', note: 'Copy the folder. That was the migration.' },
    ],
    stamp: '100% LOCAL',
  },

  outro: {
    title: 'The waitlist is a repo.',
    sub: 'Star it and you\'re in. Watch it and you\'ll know the moment something ships.',
    note: 'AL\\CE and CONT\\NUUM are pre-release. Installers will land in these repositories — no form, no launch email, no mystery.',
    ctaAlice: {
      name: 'AL\\CE',
      tagline: 'Model. Tools. State.',
      action: 'Star on GitHub',
    },
    ctaContinuum: {
      name: 'CONT\\NUUM',
      tagline: 'Files. Links. Vectors.',
      action: 'Star on GitHub',
    },
  },

  footer: {
    line: 'AL\\CE & CONT\\NUUM · pre-release · Windows-first',
    madeWith: 'No analytics on this page either. We start as we mean to go on.',
  },

  a11y: {
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    portraitAlt: 'Stylized human portrait representing AL\\CE',
    graphAria: 'Animated knowledge graph representing CONT\\NUUM',
    diagonalAria: 'Decorative diagonal split between the AL\\CE and CONT\\NUUM panes',
  },
}

const it: Copy = {
  nav: {
    alice: 'AL\\CE',
    continuum: 'CONT\\NUUM',
    bridge: 'Ponte',
    principles: 'Principi',
    github: 'GitHub',
    ariaTheme: 'Cambia tema',
    ariaLocale: 'Cambia lingua',
    skip: 'Salta al contenuto',
  },

  hero: {
    eyebrow: 'Pre-release · Windows-first · 100% locale',
    titleA: 'Una mente.',
    titleB: 'Due metà.',
    sub: 'Uno spazio di lavoro AI privato che gira sulla tua macchina e non risponde a nessuno. AL\\CE agisce. CONT\\NUUM ricorda.',
    ctaPrimary: 'Metti una stella ad AL\\CE',
    ctaSecondary: 'E una a CONT\\NUUM',
    scrollHint: 'Scorri e guardali lavorare',
    paneAlice: 'AL\\CE · modello · strumenti · stato',
    paneContinuum: 'CONT\\NUUM · file · link · vettori',
  },

  session: {
    kicker: 'Una sessione',
    title: 'Da appunti sparsi a risposte con le fonti.',
    intro: 'Uno scambio, quattro tempi. Nessun giro in cloud, nessun passaggio nascosto. Il trucco è tutto qui.',
    beats: [
      {
        user: 'I miei appunti sul progetto dei draghi sono ovunque. Mettili in ordine.',
        alice: null,
        tools: [],
        graphLabel: '14 note sparse · 0 link',
        caption: 'Chiedi. A parole tue, come lo chiederesti a una persona.',
      },
      {
        user: null,
        alice: 'Piano: trovo ogni nota che parla di draghi, controllo il resto del lore, poi archivio per bene.',
        tools: ['continuum.query("dragon")', 'files.scan("notes/")'],
        graphLabel: 'lettura di 14 note · 2 tool call',
        caption: 'AL\\CE pianifica, poi chiama gli strumenti. Il loop è esplicito: ogni passo finisce nel log.',
      },
      {
        user: null,
        alice: 'Tre gruppi: anatomia, fazioni, cronologia. Li scrivo ora, fonti allegate.',
        tools: ['continuum.write("dragons/anatomy")', 'notes.link(12)'],
        graphLabel: '+3 nodi · 12 link · fonti allegate',
        caption: 'La scrittura tocca a CONT\\NUUM. Nodi nuovi, file veri, ogni fonte citata.',
      },
      {
        user: 'Aspetta — quale fazione cavalca i draghi di ghiaccio?',
        alice: 'La Marca del Velo. Fonte: dragons/factions, collegata alla tua nota del 12 marzo.',
        tools: ['continuum.query("frost dragon riders")'],
        graphLabel: '1 query · risposta da 2 nodi',
        caption: 'Giorni dopo. Niente da rispiegare: il grafo ricorda al posto tuo.',
      },
    ],
  },

  alice: {
    kicker: 'AL\\CE',
    title: 'Un assistente che agisce — e mostra il lavoro.',
    intro: 'Un agente locale sul tuo PC. Pianifica, agisce, verifica, e annota ogni passaggio. Niente account, niente telemetria, nessuno che sbircia da sopra la spalla.',
    capabilities: [
      {
        title: 'Runtime locale',
        mono: 'LM Studio · Ollama',
        desc: 'Il modello gira sul tuo hardware. Stacca il router: AL\\CE non se ne accorge.',
      },
      {
        title: 'Voce',
        mono: 'wake word · STT · TTS',
        desc: 'faster-whisper in ingresso, Piper o Kokoro in uscita. Il microfono ascolta te. Non riferisce a nessun altro.',
      },
      {
        title: 'Loop esplicito',
        mono: 'plan → act → verify',
        desc: 'Ogni azione è una tool call tipizzata che puoi leggere. Nessuna improvvisazione fuori verbale.',
      },
      {
        title: 'Strumenti e MCP',
        mono: 'plugin tipizzati · client MCP nativo',
        desc: 'Plugin con input e output dichiarati. I server MCP si collegano senza cerimonie.',
      },
      {
        title: 'Automazione del PC',
        mono: 'screenshot · input · terminale',
        desc: 'Vede lo schermo, muove il cursore, lancia comandi. Calendario ed email compresi.',
      },
      {
        title: 'Memoria e audit',
        mono: 'memoria episodica · vettori locali · audit trail',
        desc: 'Ricorda su un vector store locale e ogni azione finisce nel log. Entrambi leggibili da te.',
      },
    ],
  },

  continuum: {
    kicker: 'CONT\\NUUM',
    title: 'Note che un\'AI può interrogare. File che puoi leggere tu.',
    intro: 'Note in markdown, un grafo della conoscenza, ricerca semantica su embedding locali. Fatto per worldbuilding, lore e la documentazione che interessa solo a te.',
    capabilities: [
      { title: 'Note', mono: 'markdown · WYSIWYG' },
      { title: 'Grafo', mono: 'backlink · grafo della conoscenza' },
      { title: 'Ricerca', mono: 'embedding locali · pgvector' },
      { title: 'Struttura', mono: 'cartelle · ereditarietà · template' },
      { title: 'File', mono: 'in chiaro su disco · leggibili ovunque' },
    ],
    fileNote: 'Apri notes/dragon.md con qualsiasi editor. È esattamente quello che sembra. Semplice per scelta.',
    hud: { depth: 'profondità', range: 'nodi in raggio', lock: 'nodo agganciato' },
    diveHint: 'scrolla · entra nel grafo',
  },

  bridge: {
    kicker: 'Il ponte',
    title: 'Un contratto, non un servizio.',
    intro: 'AL\\CE interroga. CONT\\NUUM archivia. Si parlano attraverso un contratto locale: chiedere contesto, restituire fonti, scrivere artefatti. Contesto condiviso, file separati. Niente si nasconde dietro un servizio.',
    labelTop: 'AL\\CE · interroga',
    labelBottom: 'CONT\\NUUM · archivia',
    ask: { label: 'AL\\CE · chiede', mono: 'ctx.request("drago · cronologia")' },
    reply: { label: 'CONT\\NUUM · risponde', mono: '→ 3 fonti · notes/dragon.md' },
    clausesTitle: 'Clausole',
    channels: ['indice condiviso', 'API della conoscenza', 'contesto RAG', 'event bus', 'artefatti'],
  },

  tenets: {
    kicker: 'Fascicolo',
    title: 'Semplice per scelta.',
    docId: 'FASCICOLO N. AC-066 · CLASSIFICAZIONE: PUBBLICA',
    docFoot: 'rev 2026.06 · nessun omissis',
    seals: [
      { label: 'CHIAMATE CLOUD', value: '0', note: 'Abbiamo contato due volte.' },
      { label: 'ACCOUNT RICHIESTI', value: '0', note: 'La macchina è già tua.' },
      { label: 'TELEMETRIA', value: 'nessuna', note: 'Niente telefona a casa. Non c\'è una casa da chiamare.' },
      { label: 'FORMATO FILE', value: 'in chiaro', note: 'Markdown su disco. Leggibile tra trent\'anni, o col Blocco note.' },
      { label: 'AUDIT TRAIL', value: 'completo', note: 'Ogni azione nel log. Comprese quelle imbarazzanti.' },
      { label: 'COSTO DI USCITA', value: '0', note: 'Copi la cartella. La migrazione era questa.' },
    ],
    stamp: '100% LOCALE',
  },

  outro: {
    title: 'La waitlist è un repo.',
    sub: 'Metti una stella e sei dentro. Seguilo e saprai subito quando esce qualcosa.',
    note: 'AL\\CE e CONT\\NUUM sono in pre-release. Gli installer arriveranno in questi repository: niente moduli, niente email di lancio, niente misteri.',
    ctaAlice: {
      name: 'AL\\CE',
      tagline: 'Modello. Strumenti. Stato.',
      action: 'Metti una stella',
    },
    ctaContinuum: {
      name: 'CONT\\NUUM',
      tagline: 'File. Link. Vettori.',
      action: 'Metti una stella',
    },
  },

  footer: {
    line: 'AL\\CE & CONT\\NUUM · pre-release · Windows-first',
    madeWith: 'Niente analytics neanche su questa pagina. Coerenti dal primo giorno.',
  },

  a11y: {
    themeToDark: 'Passa al tema scuro',
    themeToLight: 'Passa al tema chiaro',
    portraitAlt: 'Ritratto umano stilizzato che rappresenta AL\\CE',
    graphAria: 'Grafo della conoscenza animato che rappresenta CONT\\NUUM',
    diagonalAria: 'Taglio diagonale decorativo tra il lato AL\\CE e il lato CONT\\NUUM',
  },
}

export const copy: Record<Locale, Copy> = { en, it }
