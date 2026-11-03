import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Manifesto.css";

gsap.registerPlugin(ScrollTrigger);

export const Manifesto = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const outlineWords = section.querySelectorAll<HTMLElement>(
      ".manifesto-word--outline",
    );
    const lineReveals = section.querySelectorAll<HTMLElement>(
      ".manifesto-line-reveal",
    );
    const shapes = section.querySelectorAll<HTMLElement>(".manifesto-shape");
    const bg = section.querySelector<HTMLElement>(".manifesto-bg");
    const label = section.querySelector<HTMLElement>(".manifesto-label");
    const subCopy = section.querySelector<HTMLElement>(".manifesto-subcopy");

    if (reduced) {
      gsap.set(outlineWords, { color: "#203c2c" });
      gsap.set(lineReveals, { clipPath: "none", opacity: 1 });
      gsap.set(shapes, { opacity: 1, x: 0, y: 0 });
      gsap.set(label, { opacity: 1, x: 0 });
      gsap.set(subCopy, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(outlineWords, {
        color: "transparent",
        WebkitTextStroke: "1.5px rgba(32,60,44,0.3)",
      });
      gsap.set(lineReveals, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(shapes, { opacity: 0, x: 100, y: 50 });
      gsap.set(label, { opacity: 0, x: -30 });
      gsap.set(subCopy, { opacity: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Words move into alignment (horizontal text movement controlled by vertical scroll)
      tl.to(
        section.querySelectorAll<HTMLElement>(".manifesto-word--offset"),
        { x: 0, duration: 1, stagger: 0.1, ease: "power2.out" },
        0,
      );

      // Outline words transition to solid
      tl.to(
        outlineWords,
        {
          color: "#203c2c",
          WebkitTextStroke: "0px transparent",
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.inOut",
        },
        0.15,
      );

      // Lines reveal through vertical clipping
      tl.to(
        lineReveals,
        {
          clipPath: "inset(0 0 0 0)",
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        },
        0.2,
      );

      // Background color transition from ivory to warm sage
      tl.to(
        bg,
        { backgroundColor: "#e8dfce", duration: 1.2, ease: "none" },
        0,
      );

      // Organic shapes move at different scroll speeds
      tl.to(
        shapes[0],
        { opacity: 0.4, x: 0, y: 0, duration: 1, ease: "power2.out" },
        0.1,
      );
      tl.to(
        shapes[1],
        { opacity: 0.3, x: 0, y: 0, duration: 1.2, ease: "power2.out" },
        0.3,
      );

      // Label slides in
      tl.to(label, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 0.4);

      // Supporting copy
      tl.to(
        subCopy,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0.6,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="manifesto" className="manifesto">
      <div className="manifesto-bg" />

      <svg className="manifesto-shape manifesto-shape--1" viewBox="0 0 200 200" aria-hidden="true">
        <path
          d="M100 20 Q160 60 160 100 Q160 140 100 180 Q40 140 40 100 Q40 60 100 20 Z"
          fill="none"
          stroke="#c8d8b0"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
      <svg className="manifesto-shape manifesto-shape--2" viewBox="0 0 200 200" aria-hidden="true">
        <path
          d="M100 30 C140 30 170 60 170 100 C170 140 140 170 100 170 C60 170 30 140 30 100 C30 60 60 30 100 30 Z"
          fill="none"
          stroke="#4a6b3a"
          strokeWidth="0.8"
          opacity="0.4"
        />
      </svg>

      <div className="manifesto-content">
        <span className="manifesto-label">02 — MANIFESTO</span>

        <h2 className="manifesto-headline">
          <span className="manifesto-line manifesto-line-reveal">
            <span className="manifesto-word manifesto-word--solid">
              THE FUTURE
            </span>{" "}
            <span className="manifesto-word manifesto-word--solid manifesto-word--offset">
              OF
            </span>{" "}
            <span className="manifesto-word manifesto-word--outline manifesto-word--offset">
              BUSINESS
            </span>
          </span>
          <span className="manifesto-line manifesto-line-reveal">
            <span className="manifesto-word manifesto-word--outline">
              IS
            </span>{" "}
            <span className="manifesto-word manifesto-word--solid">
              RESPONSIBLE.
            </span>
          </span>
        </h2>

        <p className="manifesto-subcopy">
          Every purchasing decision is a statement about the world you want to
          build. We help businesses make that statement count.
        </p>
      </div>
    </section>
  );
};
