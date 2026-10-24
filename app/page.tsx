import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Hobbies from "../components/Hobbies";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { getAllPosts } from "../lib/blog";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-5">
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Hobbies posts={posts} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
