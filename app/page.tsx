import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Statement from "@/components/sections/Statement";
import Services from "@/components/sections/Services";
import SelectedWork from "@/components/sections/SelectedWork";
import ThreeDDemo from "@/components/sections/ThreeDDemo";
import Results from "@/components/sections/Results";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Statement />
        <Services />
        <SelectedWork />
        <ThreeDDemo />
        <Results />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
