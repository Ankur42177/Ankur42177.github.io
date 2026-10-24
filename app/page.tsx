import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Playbook from "../components/Playbook";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { getAllPosts } from "../lib/blog";

export default function Home() {
  const posts = getAllPosts();
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-5">
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Playbook posts={posts} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
