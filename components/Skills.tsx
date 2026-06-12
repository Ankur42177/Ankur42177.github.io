const skillGroups = {
  "AI Engineering": [
    "Vertex AI",
    "Gemini",
    "LangChain",
    "LangGraph",
    "MCP",
    "RAG",
    "Agentic AI",
  ],

  "Security Engineering": [
    "Windows Drivers",
    "Kernel Development",
    "WHQL",
    "AMSI",
    "PatchGuard",
  ],

  Backend: [
    "Java",
    "Spring Boot",
    "Node.js",
    "Django",
    "REST APIs",
    "Distributed Systems",
  ],

  DevOps: [
    "Docker",
    "Jenkins",
    "Git",
    "CI/CD",
    "MongoDB",
    "GCS",
  ],
};

export default function Skills() {
  return (
    <section className="py-24 px-10 bg-black">
      <h2 className="text-5xl font-bold text-center mb-12">
        Technical Skills
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(skillGroups).map(([title, skills]) => (
          <div
                key={title}
                    className="
                        bg-white/5
                        backdrop-blur-xl
                        border
                        border-white/10
                        rounded-3xl
                        p-6
                        hover:scale-105
                        transition
                        duration-300"
                        >
            <h3 className="text-2xl font-semibold mb-4">
              {title}
            </h3>

            <div className="space-y-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="text-gray-300"
                >
                  ✓ {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}