const projects = [
  {
    title: "RuleCraft AI",
    desc: "LLM-powered security rule generation platform using Gemini and Vertex AI.",
  },
  {
    title: "Enterprise Knowledge Portal",
    desc: "MCP + RAG based enterprise search platform for engineering teams.",
  },
  {
    title: "MCP Server",
    desc: "Agentic AI assistant integrating Confluence and internal documentation.",
  },
];

export default function Projects() {
  return (
    <section className="py-24 px-10 bg-black">
      <h2 className="text-5xl font-bold text-center mb-12">
        Featured Projects
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.title}
            className="border border-gray-700 rounded-2xl p-6"
          >
            <h3 className="text-2xl font-bold mb-3">
              {project.title}
            </h3>

            <p className="text-gray-400">
              {project.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}