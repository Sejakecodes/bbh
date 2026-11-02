import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./BrandStory.css";

gsap.registerPlugin(ScrollTrigger);

export const BrandStory = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const words = section.querySelectorAll<HTMLElement>(".story-word");
    const image = section.querySelector<HTMLElement>(".story-image");
    const symbol = section.querySelector<HTMLElement>(".story-symbol");
    const bgText = section.querySelector<HTMLElement>(".story-bg-text");
    const headline = section.querySelector<HTMLElement>(".story-headline");
    const supporting = section.querySelectorAll<HTMLElement>(".story-support p");

    if (reduced) {
      gsap.set(words, { y: 0, opacity: 1 });
      gsap.set(image, { clipPath: "none", opacity: 1, scale: 1 });
      gsap.set(supporting, { opacity: 1, y: 0 });
      gsap.set(symbol, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set(image, { clipPath: "inset(100% 0 0 0)", scale: 1.15 });
      gsap.set(supporting, { opacity: 0, y: 30 });
      gsap.set(symbol, { opacity: 0, scale: 0.5 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
      });

      tl.to(
        section.querySelectorAll<HTMLElement>(".story-word--drift"),
        { xPercent: -8, duration: 0.6, ease: "power2.inOut" },
        "-=0.3",
      );

      tl.to(
        image,
        {
          clipPath: "inset(0% 0 0 0)",
          scale: 1,
          duration: 1.0,
          ease: "power2.out",
        },
        "-=0.5",
      );

      tl.to(
        supporting,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.4",
      );

      tl.to(
        symbol,
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
        "-=0.3",
      );

      tl.to(bgText, { yPercent: -20, duration: 1.5, ease: "none" }, 0);

      tl.to(
        headline,
        { scale: 0.92, duration: 0.5, ease: "power2.inOut" },
        "-=0.2",
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="story" className="brand-story">
      <div className="story-bg-text" aria-hidden="true">
        SUSTAINABLE
      </div>

      <div className="story-grid">
        <div className="story-left">
          <span className="story-eyebrow">
            <span className="story-eyebrow-dot" />
            01 — OUR STORY
          </span>

          <h2 className="story-headline">
            <span className="story-line">
              <span className="story-word">Better</span>{" "}
              <span className="story-word story-word--drift">choices.</span>
            </span>
            <span className="story-line">
              <span className="story-word story-word--drift">A</span>{" "}
              <span className="story-word">greener</span>{" "}
              <span className="story-word">workplace.</span>
            </span>
          </h2>

          <div className="story-support">
            <p>
              Botshelo Bophelo Holdings exists to change how businesses think
              about the everyday items they use.
            </p>
            <p>
              We supply environmentally responsible office consumables —
              stationery, paper products, reusable items and biodegradable
              alternatives — to organisations that want their purchasing
              decisions to reflect their values.
            </p>
            <p>
              Every product in our catalogue is chosen for its quality,
              practicality and lower environmental footprint, so your workplace
              can function at its best without compromising what comes next.
            </p>
          </div>
        </div>

        <div className="story-right">
          <div className="story-image-wrapper">
            <img
              className="story-image"
              src="https://images.pexels.com/photos/30147837/pexels-photo-30147837.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Eco-friendly office supplies with natural materials"
              loading="lazy"
            />
          </div>
          <div className="story-symbol" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="60" height="60">
              <path
                d="M50 90 Q50 60 50 20"
                stroke="#c8d8b0"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M50 35 Q30 30 25 45 Q30 55 50 50"
                stroke="#c8d8b0"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M50 50 Q70 45 75 60 Q70 70 50 65"
                stroke="#c8d8b0"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="50" cy="20" r="4" fill="#c8d8b0" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
