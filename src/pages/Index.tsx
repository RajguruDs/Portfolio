import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { usePageMeta } from "@/lib/usePageMeta";

const Index = () => {
  usePageMeta(
    null,
    "Portfolio of Rajguru Mathiyalagan — data analytics, data science and machine learning projects with documented methods, results and limitations.",
  );

  return (
    <>
      <Hero />
      <Capabilities />
      <Projects />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </>
  );
};

export default Index;
