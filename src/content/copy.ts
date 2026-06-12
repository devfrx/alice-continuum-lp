// Bilingual copy dictionary. English is the source of truth; the Copy
// interface (with tuple-typed arrays) forces both locales to keep the
// exact same shape and the exact same counts.

export type Locale = 'en' | 'it'

interface SessionBeat {
  /** What the user says in this beat, or null if they stay quiet. */
  user: string | null
  /** What AL\CE says in this beat, or null if it has nothing to add. */
  alice: string | null
  /** Tool-call chip labels. Code, not prose, identical across locales. */
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
    /** Second display line, the accent line. */
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
    /** The pinned anatomy show: one real run, seen from inside the agent. */
    show: {
      /** The spoken command that wakes the agent. */
      wakeQuote: string
      listening: string
      planTitle: string
      planItems: [string, string, string]
      toolsTitle: string
      autoTitle: string
      autoChecks: [string, string, string]
      verifyTitle: string
      verifyChecks: [string, string, string]
      memoryTitle: string
      memoryNote: string
      auditLabel: string
      actionsLabel: string
    }
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
    /** Contract chrome: exhibit tag and the final seal line. */
    exhibit: string
    sealed: string
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
    /** Pre-release explanation; installers arrive here. */
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
    sub: 'A private AI workspace that runs entirely on your machine. AL\\CE acts, CONT\\NUUM remembers.',
    ctaPrimary: 'Star AL\\CE on GitHub',
    ctaSecondary: 'Star CONT\\NUUM',
    scrollHint: 'Scroll to watch them work',
    paneAlice: 'AL\\CE · agent · tools · voice',
    paneContinuum: 'CONT\\NUUM · notes · search · vectors',
  },

  session: {
    kicker: 'One session',
    title: 'From scattered notes to answers with sources.',
    intro: 'One exchange, four beats. Every step runs locally and lands in the log.',
    beats: [
      {
        user: 'My notes on the dragon project are everywhere. Organize them.',
        alice: null,
        tools: [],
        graphLabel: '14 notes · not yet indexed',
        caption: 'You ask, in plain words, the way you would ask a person.',
      },
      {
        user: null,
        alice: 'Plan: find every note that mentions dragons, check the rest of the lore, then file them properly.',
        tools: ['continuum.search("dragon")', 'files.read("notes/")'],
        graphLabel: 'reading 14 notes · 2 tool calls',
        caption: 'AL\\CE plans, then calls typed tools. Every step is logged.',
      },
      {
        user: null,
        alice: 'Three groups: anatomy, factions, timeline. Writing them now, sources attached.',
        tools: ['continuum.notes.create("dragons/anatomy")', 'continuum.embed(3)'],
        graphLabel: '+3 notes · embedded · sources attached',
        caption: 'CONT\\NUUM stores the notes and embeds them locally. Every source kept.',
      },
      {
        user: 'Wait, which faction rides the frost dragons?',
        alice: 'The Veil March. From dragons/factions, with your March 12 note as the source.',
        tools: ['continuum.search("frost dragon riders")'],
        graphLabel: '1 search · answer from 2 notes',
        caption: 'Days later. Nothing to re-explain: the search finds it by meaning.',
      },
    ],
  },

  alice: {
    kicker: 'AL\\CE',
    title: 'An assistant that acts, and shows its work.',
    intro: 'A local agent on your PC. It plans, acts and verifies, and writes every step to an audit log. No accounts, no telemetry.',
    capabilities: [
      {
        title: 'Local runtime',
        mono: 'LM Studio · Ollama',
        desc: 'The model runs on your own hardware through LM Studio or Ollama. No internet connection required.',
      },
      {
        title: 'Voice',
        mono: 'wake word · STT · TTS',
        desc: 'Wake word activation, faster-whisper for speech to text, Piper or Kokoro for the voice back.',
      },
      {
        title: 'Explicit agent loop',
        mono: 'plan → act → verify',
        desc: 'The model plans, calls tools, then checks the result. Every tool call is typed and validated against a JSON schema.',
      },
      {
        title: 'Tools and MCP',
        mono: 'typed plugins · native MCP client',
        desc: 'A modular plugin system for built-in tools, plus a native MCP client to connect external MCP servers.',
      },
      {
        title: 'PC automation',
        mono: 'screenshots · input · terminal',
        desc: 'It reads the screen, moves the cursor and runs whitelisted commands. Sensitive actions ask for confirmation. Calendar and email included.',
      },
      {
        title: 'Memory and audit',
        mono: 'MCP memory · knowledge graph · audit trail',
        desc: 'It keeps memory in an MCP knowledge graph and logs every tool call with its arguments and your decision. Both stay on your machine.',
      },
    ],
    show: {
      wakeQuote: '“Alice, file my notes on the dragon project.”',
      listening: 'wake word · listening',
      planTitle: 'Plan',
      planItems: [
        'find every note that mentions dragons',
        'group by theme, check the rest of the lore',
        'write to CONT\\NUUM with sources attached',
      ],
      toolsTitle: 'Typed tool calls',
      autoTitle: 'Your PC, hands on',
      autoChecks: [
        'screenshot · it reads the screen',
        'input · it moves the cursor',
        'terminal · whitelisted, sandboxed',
      ],
      verifyTitle: 'Verify',
      verifyChecks: ['3 notes written', '12 sources kept', '0 errors · 0 cloud calls'],
      memoryTitle: 'The session becomes memory',
      memoryNote: 'Stored in CONT\\NUUM and embedded locally. Next time, the answer is already there.',
      auditLabel: 'audit trail',
      actionsLabel: 'actions',
    },
  },

  continuum: {
    kicker: 'CONT\\NUUM',
    title: 'A knowledge base your AI can actually use.',
    intro: 'An AI-first knowledge base for worldbuilding, lore and characters. Markdown notes in an embedded local database, with semantic search over your own embeddings. Faster and more flexible than Obsidian.',
    capabilities: [
      { title: 'Notes', mono: 'markdown · typed entities' },
      { title: 'Semantic search', mono: 'pgvector · local RAG' },
      { title: 'Local AI', mono: 'LM Studio · Ollama' },
      { title: 'Embedded database', mono: 'PGlite · no Docker' },
      { title: 'Knowledge API', mono: 'REST · for your agent' },
    ],
    fileNote: 'A node here is a note. Embedded locally with pgvector, found by meaning, never sent to a cloud.',
    hud: { depth: 'depth', range: 'notes in range', lock: 'note locked' },
    diveHint: 'scroll · enter the graph',
  },

  bridge: {
    kicker: 'The bridge',
    title: 'A contract, not a service.',
    intro: 'AL\\CE asks, CONT\\NUUM answers. They talk over plain HTTP on localhost: AL\\CE calls the knowledge API for context, CONT\\NUUM runs a semantic search and returns notes with their sources. Two local apps, no cloud in between.',
    labelTop: 'AL\\CE · queries',
    labelBottom: 'CONT\\NUUM · answers',
    ask: { label: 'AL\\CE · asks', mono: 'POST /api/notes/search' },
    reply: { label: 'CONT\\NUUM · answers', mono: '200 · 3 notes · sources' },
    clausesTitle: 'Clauses',
    channels: ['knowledge API', 'semantic search', 'RAG context', 'cited sources', 'localhost only'],
    exhibit: 'EXHIBIT B-01 · LOCAL CONTRACT',
    sealed: 'signed · local · in force',
  },

  tenets: {
    kicker: 'Dossier',
    title: 'Local by design.',
    docId: 'FILE NO. AC-066 · CLASSIFICATION: PUBLIC',
    docFoot: 'rev 2026.06 · nothing redacted',
    seals: [
      { label: 'CLOUD CALLS', value: '0', note: 'The model runs in LM Studio or Ollama, on your machine.' },
      { label: 'ACCOUNTS', value: '0', note: 'No sign-up. Install it and run it.' },
      { label: 'TELEMETRY', value: 'none', note: 'Nothing is sent anywhere. You can watch the localhost traffic.' },
      { label: 'STORAGE', value: 'local', note: 'Embedded database for CONT\\NUUM, SQLite for AL\\CE, both in your user folder.' },
      { label: 'AUDIT TRAIL', value: 'full', note: 'Every tool call is logged with its arguments and your decision.' },
      { label: 'SOURCE', value: 'open', note: 'Both repositories are public. You can read every line.' },
    ],
    stamp: '100% LOCAL',
  },

  outro: {
    title: 'Pre-release, already public.',
    sub: 'Star the repositories to follow along. Watch them to catch each release.',
    note: 'AL\\CE and CONT\\NUUM are pre-release and 100% local. The code is already public; installers will arrive in these same repositories.',
    ctaAlice: {
      name: 'AL\\CE',
      tagline: 'Local agent · tools · voice',
      action: 'Star on GitHub',
    },
    ctaContinuum: {
      name: 'CONT\\NUUM',
      tagline: 'Knowledge base · local RAG',
      action: 'Star on GitHub',
    },
  },

  footer: {
    line: 'AL\\CE & CONT\\NUUM · pre-release · Windows-first',
    madeWith: 'No analytics and no cookies on this page.',
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
    sub: 'Uno spazio di lavoro AI privato, che gira interamente sulla tua macchina. AL\\CE agisce, CONT\\NUUM ricorda.',
    ctaPrimary: 'Metti una stella ad AL\\CE',
    ctaSecondary: 'E una a CONT\\NUUM',
    scrollHint: 'Scorri e guardali lavorare',
    paneAlice: 'AL\\CE · agente · strumenti · voce',
    paneContinuum: 'CONT\\NUUM · note · ricerca · vettori',
  },

  session: {
    kicker: 'Una sessione',
    title: 'Da appunti sparsi a risposte con le fonti.',
    intro: 'Uno scambio, quattro tempi. Ogni passo gira in locale e finisce nel log.',
    beats: [
      {
        user: 'I miei appunti sul progetto dei draghi sono ovunque. Mettili in ordine.',
        alice: null,
        tools: [],
        graphLabel: '14 note · non ancora indicizzate',
        caption: 'Chiedi, a parole tue, come lo chiederesti a una persona.',
      },
      {
        user: null,
        alice: 'Piano: trovo ogni nota che parla di draghi, controllo il resto del lore, poi le archivio per bene.',
        tools: ['continuum.search("dragon")', 'files.read("notes/")'],
        graphLabel: 'lettura di 14 note · 2 tool call',
        caption: 'AL\\CE pianifica, poi chiama strumenti tipizzati. Ogni passo è registrato.',
      },
      {
        user: null,
        alice: 'Tre gruppi: anatomia, fazioni, cronologia. Li scrivo ora, fonti allegate.',
        tools: ['continuum.notes.create("dragons/anatomy")', 'continuum.embed(3)'],
        graphLabel: '+3 note · indicizzate · fonti allegate',
        caption: 'CONT\\NUUM salva le note e le indicizza in locale. Ogni fonte conservata.',
      },
      {
        user: 'Aspetta, quale fazione cavalca i draghi di ghiaccio?',
        alice: 'La Marca del Velo. Da dragons/factions, con la tua nota del 12 marzo come fonte.',
        tools: ['continuum.search("frost dragon riders")'],
        graphLabel: '1 ricerca · risposta da 2 note',
        caption: 'Giorni dopo. Niente da rispiegare: la ricerca la trova per significato.',
      },
    ],
  },

  alice: {
    kicker: 'AL\\CE',
    title: 'Un assistente che agisce, e mostra il lavoro.',
    intro: 'Un agente locale sul tuo PC. Pianifica, agisce e verifica, e scrive ogni passo in un log di audit. Niente account, niente telemetria.',
    capabilities: [
      {
        title: 'Runtime locale',
        mono: 'LM Studio · Ollama',
        desc: 'Il modello gira sul tuo hardware tramite LM Studio o Ollama. Nessuna connessione a internet richiesta.',
      },
      {
        title: 'Voce',
        mono: 'wake word · STT · TTS',
        desc: 'Attivazione con wake word, faster-whisper per il riconoscimento vocale, Piper o Kokoro per la voce in uscita.',
      },
      {
        title: 'Loop esplicito',
        mono: 'plan → act → verify',
        desc: 'Il modello pianifica, chiama gli strumenti, poi verifica il risultato. Ogni tool call è tipizzata e validata con JSON schema.',
      },
      {
        title: 'Strumenti e MCP',
        mono: 'plugin tipizzati · client MCP nativo',
        desc: 'Un sistema di plugin modulari per gli strumenti interni, più un client MCP nativo per collegare server MCP esterni.',
      },
      {
        title: 'Automazione del PC',
        mono: 'screenshot · input · terminale',
        desc: 'Legge lo schermo, muove il cursore e lancia comandi in whitelist. Le azioni sensibili chiedono conferma. Calendario ed email inclusi.',
      },
      {
        title: 'Memoria e audit',
        mono: 'memoria MCP · knowledge graph · audit trail',
        desc: 'Tiene la memoria in un knowledge graph MCP e registra ogni tool call con i suoi argomenti e la tua decisione. Entrambi restano sulla tua macchina.',
      },
    ],
    show: {
      wakeQuote: '«Alice, archivia gli appunti sul progetto drago.»',
      listening: 'wake word · in ascolto',
      planTitle: 'Piano',
      planItems: [
        'trova ogni nota che cita i draghi',
        'raggruppa per tema, controlla il resto del lore',
        'scrivi in CONT\\NUUM con le fonti allegate',
      ],
      toolsTitle: 'Tool call tipizzate',
      autoTitle: 'Il tuo PC, mani sulla tastiera',
      autoChecks: [
        'screenshot · legge lo schermo',
        'input · muove il cursore',
        'terminale · whitelist e sandbox',
      ],
      verifyTitle: 'Verifica',
      verifyChecks: ['3 note scritte', '12 fonti conservate', '0 errori · 0 chiamate cloud'],
      memoryTitle: 'La sessione diventa memoria',
      memoryNote: 'Salvata in CONT\\NUUM e indicizzata in locale. La prossima volta la risposta c\'è già.',
      auditLabel: 'audit trail',
      actionsLabel: 'azioni',
    },
  },

  continuum: {
    kicker: 'CONT\\NUUM',
    title: 'Una base di conoscenza che la tua AI può davvero usare.',
    intro: 'Una knowledge base AI-first per worldbuilding, lore e personaggi. Note in markdown in un database locale integrato, con ricerca semantica sui tuoi embedding. Più veloce e flessibile di Obsidian.',
    capabilities: [
      { title: 'Note', mono: 'markdown · entità tipizzate' },
      { title: 'Ricerca semantica', mono: 'pgvector · RAG locale' },
      { title: 'AI locale', mono: 'LM Studio · Ollama' },
      { title: 'Database integrato', mono: 'PGlite · niente Docker' },
      { title: 'API della conoscenza', mono: 'REST · per il tuo agente' },
    ],
    fileNote: 'Un nodo qui è una nota. Indicizzata in locale con pgvector, trovata per significato, mai inviata a un cloud.',
    hud: { depth: 'profondità', range: 'note in raggio', lock: 'nota agganciata' },
    diveHint: 'scrolla · entra nel grafo',
  },

  bridge: {
    kicker: 'Il ponte',
    title: 'Un contratto, non un servizio.',
    intro: 'AL\\CE chiede, CONT\\NUUM risponde. Si parlano via HTTP su localhost: AL\\CE chiama l\'API della conoscenza per avere contesto, CONT\\NUUM esegue una ricerca semantica e restituisce le note con le loro fonti. Due app locali, nessun cloud in mezzo.',
    labelTop: 'AL\\CE · interroga',
    labelBottom: 'CONT\\NUUM · risponde',
    ask: { label: 'AL\\CE · chiede', mono: 'POST /api/notes/search' },
    reply: { label: 'CONT\\NUUM · risponde', mono: '200 · 3 note · fonti' },
    clausesTitle: 'Clausole',
    channels: ['API conoscenza', 'ricerca semantica', 'contesto RAG', 'fonti citate', 'solo localhost'],
    exhibit: 'ALLEGATO B-01 · CONTRATTO LOCALE',
    sealed: 'firmato · locale · in vigore',
  },

  tenets: {
    kicker: 'Fascicolo',
    title: 'Locale per scelta.',
    docId: 'FASCICOLO N. AC-066 · CLASSIFICAZIONE: PUBBLICA',
    docFoot: 'rev 2026.06 · nessun omissis',
    seals: [
      { label: 'CHIAMATE CLOUD', value: '0', note: 'Il modello gira in LM Studio o Ollama, sulla tua macchina.' },
      { label: 'ACCOUNT', value: '0', note: 'Niente registrazione. Lo installi e lo usi.' },
      { label: 'TELEMETRIA', value: 'nessuna', note: 'Niente viene inviato da nessuna parte. Puoi controllare il traffico su localhost.' },
      { label: 'ARCHIVIAZIONE', value: 'locale', note: 'Database integrato per CONT\\NUUM, SQLite per AL\\CE, entrambi nella tua cartella utente.' },
      { label: 'AUDIT TRAIL', value: 'completo', note: 'Ogni tool call è registrata con i suoi argomenti e la tua decisione.' },
      { label: 'CODICE', value: 'aperto', note: 'Entrambi i repository sono pubblici. Puoi leggere ogni riga.' },
    ],
    stamp: '100% LOCALE',
  },

  outro: {
    title: 'Pre-release, già pubblici.',
    sub: 'Metti una stella ai repository per seguirli. Mettili in watch per ogni release.',
    note: 'AL\\CE e CONT\\NUUM sono in pre-release e 100% locali. Il codice è già pubblico; gli installer arriveranno in questi stessi repository.',
    ctaAlice: {
      name: 'AL\\CE',
      tagline: 'Agente locale · strumenti · voce',
      action: 'Metti una stella',
    },
    ctaContinuum: {
      name: 'CONT\\NUUM',
      tagline: 'Base di conoscenza · RAG locale',
      action: 'Metti una stella',
    },
  },

  footer: {
    line: 'AL\\CE & CONT\\NUUM · pre-release · Windows-first',
    madeWith: 'Niente analytics e niente cookie su questa pagina.',
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
