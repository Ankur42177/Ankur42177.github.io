// Edit everything about the portfolio here.
// Text wrapped in **double stars** is rendered as a highlighted metric (see components/Rich.tsx).

export const profile = {
  name: "Ankur Kumar",
  firstName: "Ankur",
  role: "Backend & Systems Software Engineer",
  title: "Software Development Engineer II",
  company: "Trellix",
  location: "Bangalore, India",
  tagline:
    "3+ years at Trellix building Java/Spring Boot backend services, C++ Windows drivers and Python AI agents for enterprise environments with 100K+ endpoints. After hours I build distributed systems from scratch to learn how they scale.",
  rotating: ["Spring Boot services", "Windows kernel drivers", "agentic AI tools", "microservices at scale", "prompt security"],
  email: "ankur42177@gmail.com",
  phone: "", // e.g. "+91 98765 43210" — the phone card appears once this is set
  github: "https://github.com/Ankur42177",
  linkedin: "https://www.linkedin.com/in/ankur-kumar-007/",
  resume: "/resume.pdf",
};

// ---------------------------------------------------------------- projects

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  rank: string;            // playing-card corner index
  suit: "♠" | "♥" | "♦" | "♣";
  kind: string;
  hue: [string, string];   // card art gradient
  award?: string;
  status?: string;
  pitch: string;
  highlights: string[];
  stack: string[];
  flow?: string[];         // animated pipeline shown in the detail panel
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "pulse",
    title: "Pulse",
    subtitle: "The Dark Algorithm · microservices at scale",
    rank: "A",
    suit: "♠",
    kind: "Distributed systems",
    hue: ["#2b7a7d", "#1d2b4a"],
    status: "Phases 0–8 & 10 shipped",
    pitch:
      "A learning-first microservices blog for Tech and Football with Harvey, a RAG chatbot. Every scaling pattern is implemented, measured and recorded as an architecture decision.",
    highlights: [
      "**4 Spring Boot services** behind a Spring Cloud Gateway with edge JWT validation and Redis token-bucket **rate limiting**",
      "**Transactional outbox** → Kafka with idempotent consumers; RabbitMQ work queue with **retries + DLQ** and an SSRF/XXE-safe fetcher",
      "Redis **cache-aside with single-flight**, view counters and trending; keyset pagination, Flyway, RFC 9457 errors",
      "Harvey: **RAG over pgvector hybrid search**, a tool-calling agent loop with guardrails, streaming, and live index sync from Kafka",
      "Packaged for **Kubernetes with Helm** on kind, autoscaled with **HPA + KEDA**; 18 ADRs, Testcontainers ITs, k6 load tests",
    ],
    stack: ["Java 25", "Spring Boot 4", "Spring AI", "Kafka", "RabbitMQ", "Redis", "PostgreSQL + pgvector", "Next.js 16", "Docker", "Kubernetes", "Helm"],
    flow: ["Next.js", "Gateway", "Services", "Kafka", "Harvey (RAG)"],
    links: [{ label: "Source on GitHub", href: "https://github.com/Ankur42177/The-Dark-Algorithm" }],
  },
  {
    id: "intruva",
    title: "Intruva",
    subtitle: "Prompt intelligence & prompt security",
    rank: "K",
    suit: "♦",
    kind: "AI security",
    hue: ["#6551f0", "#2cc6cf"],
    status: "Pilot preview",
    pitch:
      "Diagnoses what a prompt is missing, keeps every word you meant, and catches secrets, personal data and prompt injection on your device before anything reaches an AI.",
    highlights: [
      "**One deterministic engine, four surfaces**: web app, Chrome extension, MCP server and developer API share the same contracts",
      "**On-device security scanner** for secrets, PII, prompt injection, exfiltration and risky agent instructions, with one-click redaction",
      "Asks only **1–3 ranked questions** (impact × uncertainty × answerability ÷ effort) and labels every assumption it makes",
      "**7 intent-preservation checks** so the optimized prompt never drops a goal, constraint or prohibition",
      "Liquid-glass UI with a **raymarched WebGL sculpture**, WAI-ARIA components and three-state motion preferences; **72 engine tests**",
    ],
    stack: ["TypeScript", "Next.js 16", "React 19", "Tailwind v4", "Motion", "WebGL / GLSL", "npm workspaces", "MCP"],
    flow: ["Prompt", "Scan", "Diagnose", "Clarify", "Optimize", "Verify"],
    links: [{ label: "Source on GitHub", href: "https://github.com/Ankur42177/Intruva" }],
  },
  {
    id: "rulecraft",
    title: "RuleCraft AI",
    subtitle: "Natural language → security Expert Rules",
    rank: "Q",
    suit: "♥",
    kind: "LLM platform",
    hue: ["#e2675a", "#5b2a86"],
    award: "🏆 2nd place · $5K · Trellix ASCEND Hack-AI-Thon 2025",
    pitch:
      "An LLM platform that converts natural-language security intent into production-ready Expert Rules (TCL) for Exploit Prevention.",
    highlights: [
      "Cut rule-configuration errors by **90%**",
      "Owned the **LLMOps lifecycle**: Python-generated datasets on GCS, Gemini fine-tuning on Vertex AI and prompt engineering",
      "Reached **85%+ first-pass accuracy**; benchmarked OpenAI, Anthropic, Gemini and Mistral",
      "Built an **MCP server** so AI assistants can generate and validate rules directly",
    ],
    stack: ["Python", "Gemini", "Vertex AI", "Fine-tuning", "GCS", "MCP", "LLM evaluation"],
    flow: ["Intent", "Gemini (tuned)", "TCL rule", "Validate", "Endpoint"],
    links: [],
  },
  {
    id: "knowledge",
    title: "Knowledge Portal",
    subtitle: "Enterprise docs, answerable from any AI tool",
    rank: "J",
    suit: "♣",
    kind: "RAG + MCP",
    hue: ["#3f9c9f", "#0b2540"],
    pitch:
      "An AI knowledge platform that connects Confluence, onboarding guides and release docs to AI assistants through MCP, so engineers can query internal documentation from their own tools.",
    highlights: [
      "**MCP integrations** expose internal sources to AI assistants",
      "**RAG semantic search** with contextual retrieval across Confluence, guides and release notes",
      "Real-time UI over **Socket.IO**; faster onboarding and less manual searching",
    ],
    stack: ["MCP", "RAG", "LangChain", "Vertex AI", "React", "Node.js", "MongoDB", "Socket.IO"],
    flow: ["Confluence", "Embed", "Retrieve", "MCP", "Assistant"],
    links: [],
  },
];

// ---------------------------------------------------------------- experience

export type Track = "backend" | "systems" | "ai";
export const tracks: { id: Track | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "backend", label: "Backend" },
  { id: "systems", label: "Systems & security" },
  { id: "ai", label: "AI & LLMs" },
];

export type Role = {
  id: string;
  role: string;
  note?: string;
  company: string;
  companyNote?: string;
  period: string;
  location: string;
  points: { text: string; track: Track }[];
};

export const experience: Role[] = [
  {
    id: "sde2",
    role: "Software Development Engineer II",
    note: "promoted from SDE I",
    company: "Trellix",
    companyNote: "formerly McAfee & FireEye",
    period: "Jul 2023 — Present",
    location: "Bangalore, India",
    points: [
      { track: "backend", text: "Developed and scaled **ePolicy Orchestrator (ePO) server-side extensions** in Java, Spring Boot and SQL Server across 5 security modules, delivering policies, client tasks and threat events to environments with **100K+ endpoints**" },
      { track: "backend", text: "Re-engineered server-side **Access Protection subrule handling** to de-duplicate before delivery, cutting duplicate policies reaching endpoints by **~90%** and helping retain a key enterprise account" },
      { track: "backend", text: "Designed and built a **Spring Boot threat-event pipeline** that ingests, correlates, enriches and persists events from multiple endpoint products, with in-house distributed aggregation feeding real-time dashboards" },
      { track: "systems", text: "Architected ePO support for **cross-platform Expert Rules** (Windows, macOS, Linux) in Exploit Prevention for vendor- and customer-defined signatures, partnering with threat research on rollout" },
      { track: "backend", text: "Resolved **high-severity customer escalations** in the ePO and extension database layers with SQL remediation and permanent product fixes, protecting **$5M+ in renewals**" },
      { track: "systems", text: "Implemented **pre-boot policy enforcement in C++ Windows drivers**, applied before user-mode services start, and refactored tightly coupled legacy logic into modular, interface-based components" },
      { track: "systems", text: "Instrumented Endpoint Security services with **Python monitoring** and CPU-threshold alerts, improving uptime visibility **50%** and cutting missed or delayed detections **25%**" },
      { track: "ai", text: "Built an **AI triage agent** in Python (LangChain) with reusable skills that diagnose and fix ePO extension escalations, cutting turnaround **~70%**; with a server-side refactor, active escalations fell **80%**" },
      { track: "ai", text: "Created **RuleCraft AI**, turning natural-language security intent into production-ready Expert Rules (TCL) and reducing rule-configuration errors **90%**" },
      { track: "ai", text: "Drove RuleCraft's **LLMOps lifecycle**: datasets on GCS, Gemini fine-tuning on Vertex AI and prompt engineering to **85%+ first-pass accuracy**; benchmarked four model families and built an MCP server" },
    ],
  },
  {
    id: "intern",
    role: "Software Engineer Intern",
    company: "Trellix",
    period: "Jan 2023 — Jun 2023",
    location: "Bangalore, India",
    points: [
      { track: "systems", text: "Contributed to the **Miura C2C server**, which improved threat-analysis accuracy by **30%**" },
      { track: "systems", text: "Engineered a **secure transfer pipeline** for binaries and collected artifacts between client machines and the server; ran **SAST/DAST** scans and Metasploit exploit simulations" },
    ],
  },
];

export const awards = [
  { title: "2nd Place ($5K)", detail: "Trellix ASCEND Hack-AI-Thon 2025 · RuleCraft AI" },
  { title: "Innovation Showcase", detail: "Trellix · Miura C2C" },
];

export const education = {
  school: "National Institute of Technology (NIT) Manipur",
  degree: "B.Tech, Electronics and Communication Engineering",
  period: "2019 — 2023",
  grade: "CGPA 8.44 / 10",
};

// ---------------------------------------------------------------- learning lab

export type Phase = { n: number; title: string; status: "done" | "wip" | "next"; learned: string[] };

export const pulsePhases: Phase[] = [
  { n: 0, title: "Foundations", status: "done", learned: ["Maven multi-module monorepo", "Docker Compose profiles", "Architecture Decision Records", "Service boundaries: one database per service"] },
  { n: 1, title: "content-service", status: "done", learned: ["Spring Data JPA + Flyway migrations", "Keyset pagination (never OFFSET)", "RFC 9457 Problem Details", "Testcontainers integration tests"] },
  { n: 2, title: "Next.js website", status: "done", learned: ["Server Components & ISR", "On-demand tag revalidation", "JS budgets & Lighthouse 100", "Streaming + loading states"] },
  { n: 3, title: "Redis", status: "done", learned: ["Cache-aside", "Single-flight stampede protection", "Atomic view counters", "Trending with sorted sets"] },
  { n: 4, title: "Admin & auth", status: "done", learned: ["JWT access + refresh-token rotation", "CSRF protection", "Sanitized Markdown (XSS)", "Password hashing"] },
  { n: 5, title: "API gateway", status: "done", learned: ["Spring Cloud Gateway on WebFlux", "JWT validation at the edge", "Token-bucket rate limiting", "Client identity & routing"] },
  { n: 6, title: "Kafka events", status: "done", learned: ["Transactional outbox", "Idempotent consumers", "Events as past-tense facts", "Dead-letter topics"] },
  { n: 7, title: "RabbitMQ ingestion", status: "done", learned: ["Work queues & prefetch", "Retry queues + DLQ", "SSRF / XXE-safe fetching", "CQRS read model"] },
  { n: 8, title: "Harvey (AI assistant)", status: "done", learned: ["Spring AI + local LLMs", "RAG with pgvector hybrid search", "Tool calling & agent guardrails", "Streaming answers, Kafka index sync"] },
  { n: 9, title: "Observability", status: "wip", learned: ["Micrometer + Prometheus", "OpenTelemetry tracing", "Latency histograms", "Grafana dashboards & alerts"] },
  { n: 10, title: "Kubernetes", status: "done", learned: ["Multi-stage Docker images", "Helm charts", "kind local clusters", "HPA + KEDA autoscaling"] },
  { n: 11, title: "CI/CD", status: "next", learned: ["GitHub Actions pipelines", "Testcontainers in CI", "Image build & scan", "Helm lint & deploy"] },
];

export const intruvaPipeline = [
  { step: "Validate", detail: "Size limits and empty-prompt checks before any work starts." },
  { step: "Scan", detail: "Secrets, PII, injection and exfiltration found on-device, always first." },
  { step: "Classify", detail: "Weighted signals pick one of 9 task blueprints, with a stated confidence." },
  { step: "Diagnose", detail: "Coverage per blueprint field; missing context ranked by impact." },
  { step: "Clarify", detail: "At most 3 questions; everything else becomes a labelled assumption." },
  { step: "Build", detail: "A structured, model-aware prompt (Markdown or XML) that keeps your wording." },
  { step: "Verify", detail: "7 preservation checks, a security re-scan and an honest re-score." },
];

export const intruvaLearned = [
  "Contract-first design: one set of types for every surface",
  "npm workspaces: a shared engine package",
  "Prompt-injection quarantine (data, not instructions)",
  "Secret & PII detection with redaction",
  "WebGL raymarching: SDF blobs, Fresnel, iridescence",
  "WAI-ARIA combobox, roving tabindex, live regions",
  "Motion design with reduced-motion fallbacks",
  "Static export + edge hosting",
];

// ---------------------------------------------------------------- skills

export const skills: Record<string, string[]> = {
  "Languages": ["Java", "Python", "C++", "SQL", "TypeScript", "JavaScript"],
  "Backend & Data": ["Spring Boot", "Spring Cloud Gateway", "REST APIs", "Microservices", "Kafka", "RabbitMQ", "Redis", "PostgreSQL", "SQL Server", "MongoDB", "Node.js", "Socket.IO"],
  "AI & LLMs": ["AI Agents", "LangChain", "LangGraph", "Spring AI", "RAG", "pgvector", "MCP", "Fine-tuning", "LLM Evaluation", "LLMOps", "Vertex AI (Gemini)"],
  "Systems & Security": ["Windows Internals", "Kernel-Mode Drivers", "WinDbg", "AMSI", "Endpoint Security", "Prompt Security", "SAST / DAST"],
  "Cloud & DevOps": ["Docker", "Kubernetes", "Helm", "KEDA", "GitHub Actions", "Jenkins", "Google Cloud", "Git"],
  "Core CS": ["Data Structures & Algorithms", "System Design", "Distributed Systems", "Object-Oriented Design"],
};

// Labels for the "tech orbs" in Play mode.
export const playOrbs = ["Java", "Spring", "Kafka", "Redis", "K8s", "RAG", "MCP", "C++", "SQL", "Helm", "LLM", "Rabbit", "Next", "Python", "Docker", "pgvector"];
