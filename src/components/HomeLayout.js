import { useRef, useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import NewsEvents from "./NewsEvents";
import Partners from "./Partners";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function HomeLayout() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const newsRef = useRef(null);
  const partnersRef = useRef(null);

  const sectionRefs = useMemo(
    () => ({
      Home: homeRef,
      About: aboutRef,
      Features: featuresRef,
      "News & Events": newsRef,
      Partners: partnersRef,
    }),
    []
  );

  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 130;

      for (const [key, ref] of Object.entries(sectionRefs)) {
        const el = ref.current;
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRefs]);

  return (
    <>
      <Navbar
        sectionRefs={sectionRefs}
        activeNav={activeSection}
        setActiveSection={setActiveSection}
        isHomePage={true}
      />
      <div ref={homeRef}>
        <Hero />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={featuresRef}>
        <Features />
      </div>
      <div ref={newsRef}>
        <NewsEvents />
      </div>
      <div ref={partnersRef}>
        <Partners />
      </div>
      <Footer />
      <BackToTop setActiveSection={setActiveSection} />
    </>
  );
}
