import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FinalCTA.css";

gsap.registerPlugin(ScrollTrigger);

export const FinalCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const bgLayer = section.querySelector<HTMLElement>(".cta-bg-layer");
    const headlineWords = section.querySelectorAll<HTMLElement>(".cta-word");
    const subcopy = section.querySelector<HTMLElement>(".cta-subcopy");
    const buttons = section.querySelectorAll<HTMLElement>(".cta-btn");
    const organic = section.querySelector<HTMLElement>(".cta-organic");

    if (reduced) {
      gsap.set(bgLayer, { opacity: 1 });
      gsap.set(headlineWords, { yPercent: 0, opacity: 1 });
      gsap.set(subcopy, { opacity: 1, y: 0 });
      gsap.set(buttons, { opacity: 1, y: 0 });
      gsap.set(organic, { opacity: 0.05 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bgLayer, { opacity: 0 });
      gsap.set(headlineWords, { yPercent: 110, opacity: 0 });
      gsap.set(subcopy, { opacity: 0, y: 30 });
      gsap.set(buttons, { opacity: 0, y: 30 });
      gsap.set(organic, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 20%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Background transitions into deep forest-green
      tl.to(bgLayer, { opacity: 1, duration: 1, ease: "power2.inOut" }, 0);

      // Organic graphic moves behind the headline
      tl.to(
        organic,
        { opacity: 0.06, scale: 1, duration: 1.2, ease: "power2.out" },
        0,
      );

      // Headline reveals through vertical mask
      tl.to(
        headlineWords,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.3,
      );

      // Subcopy
      tl.to(
        subcopy,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0.6,
      );

      // CTA buttons enter with directional movement
      tl.to(
        buttons[0],
        { opacity: 1, y: 0, x: 0, duration: 0.6, ease: "power2.out" },
        0.7,
      );
      tl.to(
        buttons[1],
        { opacity: 1, y: 0, x: 0, duration: 0.6, ease: "power2.out" },
        0.8,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="final-cta">
      <div className="cta-bg-layer" />

      <svg
        className="cta-organic"
        viewBox="0 0 600 600"
        aria-hidden="true"
      >
        <path
          d="M300 580 Q300 400 300 300 Q200 250 150 180 Q150 80 250 50 Q350 30 400 100 Q380 180 300 200"
          stroke="#c8d8b0"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M250 50 Q180 40 130 80"
          stroke="#c8d8b0"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M400 100 Q470 90 510 130"
          stroke="#c8d8b0"
          strokeWidth="0.8"
          fill="none"
        />
        <circle cx="250" cy="50" r="6" fill="#c8d8b0" opacity="0.5" />
        <circle cx="300" cy="580" r="5" fill="#c8d8b0" opacity="0.3" />
      </svg>

      <div className="cta-content">
        <span className="cta-eyebrow">
          <span className="cta-eyebrow-dot" />
          06 — LET'S BEGIN
        </span>

        <h2 className="cta-headline">
          <span className="cta-line">
            <span className="cta-word">Make</span>{" "}
            <span className="cta-word">your</span>{" "}
            <span className="cta-word">workplace</span>
          </span>
          <span className="cta-line">
            <span className="cta-word">a</span>{" "}
            <span className="cta-word cta-word--accent">better</span>{" "}
            <span className="cta-word">place.</span>
          </span>
        </h2>

        <p className="cta-subcopy">
          Make more conscious choices with sustainable office consumables from
          Botshelo Bophelo Holdings.
        </p>

        <div className="cta-buttons">
          <a href="#cta" className="cta-btn cta-btn--primary" data-cursor="Enquire">
            <span>Enquire with us</span>
            <span className="cta-btn-arrow" aria-hidden="true">→</span>
          </a>
          <a href="#categories" className="cta-btn cta-btn--secondary">
            <span>Explore our products</span>
          </a>
        </div>

        <footer className="cta-footer">
          <div className="cta-footer-brand">
            <span className="cta-footer-monogram">BBH</span>
            <span>BOTSHELO BOPHELO HOLDINGS</span>
          </div>
          <span className="cta-footer-note">
            CONSIDERED MATERIALS. CONSCIOUS BRANDS.
          </span>
        </footer>
      </div>
    </section>
  );
};
