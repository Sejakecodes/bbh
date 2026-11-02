import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WhySustainable.css";

gsap.registerPlugin(ScrollTrigger);

export const WhySustainable = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const divider = section.querySelector<HTMLElement>(".why-divider");
    const conventional = section.querySelector<HTMLElement>(".why-conventional");
    const sustainable = section.querySelector<HTMLElement>(".why-sustainable-side");
    const convImage = section.querySelector<HTMLElement>(".why-conv-image");
    const susImage = section.querySelector<HTMLElement>(".why-sus-image");
    const statement = section.querySelector<HTMLElement>(".why-statement");
    const labels = section.querySelectorAll<HTMLElement>(".why-side-label");

    if (reduced) {
      gsap.set(divider, { xPercent: -100 });
      gsap.set(conventional, { clipPath: "none" });
      gsap.set(sustainable, { clipPath: "none" });
      gsap.set(statement, { opacity: 1, y: 0 });
      gsap.set(labels, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(divider, { xPercent: -100 });
      gsap.set(conventional, { clipPath: "inset(0 0 0 0)" });
      gsap.set(sustainable, { clipPath: "inset(0 0 0 100%)" });
      gsap.set(convImage, { scale: 1.2 });
      gsap.set(susImage, { scale: 1.2 });
      gsap.set(statement, { opacity: 0, y: 50 });
      gsap.set(labels, { opacity: 0 });

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

      // Horizontal dividing line travels across the viewport
      tl.to(divider, { xPercent: 0, duration: 1.2, ease: "power2.inOut" }, 0);

      // Sustainable side reveals through masking
      tl.to(
        sustainable,
        { clipPath: "inset(0 0 0 0)", duration: 1.2, ease: "power2.inOut" },
        0,
      );

      // Conventional side fades back
      tl.to(
        conventional,
        { opacity: 0.3, duration: 1, ease: "power2.inOut" },
        0.2,
      );

      // Images subtly transition (scale)
      tl.to(convImage, { scale: 1.05, duration: 1.2, ease: "none" }, 0);
      tl.to(susImage, { scale: 1.05, duration: 1.2, ease: "none" }, 0);

      // Labels appear
      tl.to(labels, { opacity: 1, duration: 0.5, stagger: 0.15, ease: "power2.out" }, 0.3);

      // Statement appears
      tl.to(
        statement,
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        0.7,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-sustainable" className="why-sustainable">
      <div className="why-conventional">
        <img
          className="why-conv-image"
          src="https://images.pexels.com/photos/6368841/pexels-photo-6368841.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Conventional disposable office supplies"
          loading="lazy"
        />
        <div className="why-conv-overlay" />
        <span className="why-side-label why-side-label--left">
          CONVENTIONAL
        </span>
      </div>

      <div className="why-sustainable-side">
        <img
          className="why-sus-image"
          src="https://images.pexels.com/photos/4715631/pexels-photo-4715631.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Sustainable eco-friendly office products"
          loading="lazy"
        />
        <div className="why-sus-overlay" />
        <span className="why-side-label why-side-label--right">
          RESPONSIBLE
        </span>
      </div>

      <div className="why-divider" aria-hidden="true" />

      <div className="why-center">
        <h2 className="why-statement">
          The difference is not just in the product.
          <br />
          <em>It's in the choice.</em>
        </h2>
      </div>
    </section>
  );
};
