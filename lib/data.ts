// Edit everything about the portfolio here.

export const profile = {
  name: "Ankur Kumar",
  firstName: "Ankur",
  role: "AI & Security Engineer",
  company: "Trellix",
  location: "Bangalore, India",
  tagline:
    "I build agentic AI systems, security pipelines and low-level Windows drivers — and I like shipping things that actually get used.",
  email: "ankur42177@gmail.com",
  phone: "", // e.g. "+91 98765 43210" — the phone card appears once this is set
  github: "https://github.com/Ankur42177",
  linkedin: "https://www.linkedin.com/in/ankur-kumar-007/",
  resume: "/resume.pdf",
};

export const stats = [
  { value: "3+", label: "Years at Trellix" },
  { value: "$5K", label: "Hackathon award" },
  { value: "90%", label: "Fewer rule errors" },
  { value: "85%", label: "AI accuracy" },
];

export const projects = [
  {
    title: "RuleCraft AI",
    award: "🏆 2nd Place · $5,000 Award",
    description:
      "An LLM-powered platform that generates security detection rules from natural language, built on Gemini models fine-tuned with Vertex AI.",
    highlights: [
      "Cut rule-authoring errors by 90%",
      "Reached 85% accuracy on generated rules after fine-tuning Gemini on Vertex AI",
      "Won 2nd place and a $5,000 hackathon award",
    ],
    tags: ["Gemini", "Vertex AI", "LLM fine-tuning", "Security"],
    links: [] as { label: string; href: string }[],
  },
];

export const experience = [
  {
    role: "Software Engineer",
    company: "Trellix",
    period: "Jun 2023 — Present",
    location: "Bangalore, India",
    points: [
      "Built RuleCraft AI, a Gemini-based rule generator that won 2nd place and a $5,000 award",
      "Fine-tuned Gemini models on Vertex AI for security use cases",
      "Built a threat event processing pipeline for distributed security event processing",
      "Developed Windows kernel drivers and took them through WHQL certification",
    ],
  },
];

export const skills: Record<string, string[]> = {
  "AI Engineering": ["Vertex AI", "Gemini", "LangChain", "LangGraph", "MCP", "RAG", "Agentic AI"],
  "Security": ["Windows Drivers", "Kernel Development", "WHQL", "AMSI", "PatchGuard"],
  "Backend": ["Java", "Spring Boot", "Node.js", "Django", "REST APIs", "Distributed Systems"],
  "DevOps & Data": ["Docker", "Jenkins", "Git", "CI/CD", "MongoDB", "GCS"],
};
