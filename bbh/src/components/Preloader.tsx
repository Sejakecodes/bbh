import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RoseMark } from "./RoseMark";
import "./Preloader.css";

interface PreloaderProps {
  onComplete: () => void;
  videoReady: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  videoReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);
  const roseRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const [grid] = useState(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth <= 768;
    return {
      cols: mobile ? 10 : 20,
      rows: mobile ? 20 : 30,
    };
  });

  const fragments = Array.from({ length: grid.cols * grid.rows }, (_, id) => ({
    id,
    row: Math.floor(id / grid.cols),
    col: id % grid.cols,
  }));

  useEffect(() => {
    if (!videoReady || !containerRef.current) return;

    const container = containerRef.current;
    const monogram = monogramRef.current;
    const rose = roseRef.current;
    const content = contentRef.current;
    const fragmentElements =
      fragmentsRef.current?.querySelectorAll<HTMLElement>(".fragment");

    const heroTextElements = document.querySelectorAll(
      ".bbh-hero__eyebrow, .bbh-hero__title, .bbh-hero__description, .bbh-hero__cta",
    );

    if (!monogram || !rose || !fragmentElements?.length || !content) return;

    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      onCompleteRef.current();
    };

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Initial Setup
      gsap.set(container, { autoAlpha: 1 });
      gsap.set(monogram, {
        autoAlpha: 0,
        y: 20,
        scale: 1,
        letterSpacing: "0.5em",
      });
      gsap.set(fragmentElements, {
        y: 0,
        x: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
        autoAlpha: 1,
        z: 0,
      });
      gsap.set(rose, {
        autoAlpha: 0,
        scale: 0.7,
        transformOrigin: "center center",
      });

      // Hide the hero text initially
      gsap.set(heroTextElements, { autoAlpha: 0, y: 30 });

      if (reducedMotion) {
        gsap.to(container, {
          autoAlpha: 0,
          duration: 0.25,
          onComplete: finish,
        });
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });

      // Scene 1: Pause on solid green
      tl.to({}, { duration: 0.35 });

      // Scene 2A: Monogram Reveal
      tl.to(monogram, {
        autoAlpha: 1,
        y: 0,
        letterSpacing: "0.1em",
        duration: 0.9,
        ease: "power3.out",
      });

      tl.to({}, { duration: 0.45 });

      // Hide Monogram
      tl.to(monogram, {
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.3,
        ease: "power2.in",
      });

      // --- SCENE 2B: Reveal Hero Text & Break Curtain ---

      // Fade the solid green content background to transparent so the video shows
      tl.to(content, {
        backgroundColor: "transparent",
        duration: 0.6,
        ease: "power2.inOut",
      });

      // Animate the hero text in
      tl.to(
        heroTextElements,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4",
      );

      // Pause to let the user read
      tl.to({}, { duration: 1.2 });

      // Prepare the blocks for the fall
      const sortedFragments = Array.from(fragmentElements).sort(
        (a, b) =>
          Number(a.dataset.row) - Number(b.dataset.row) ||
          Number(a.dataset.col) - Number(b.dataset.col),
      );

      const trajectories = sortedFragments.map((element) => {
        const row = Number(element.dataset.row);
        const col = Number(element.dataset.col);
        const seed = (row * 37 + col * 17) % 101;

        const random = (min: number, max: number, offset: number) =>
          min + (((seed + offset) % 101) / 100) * (max - min);

        return {
          element,
          row,
          col,
          drift: random(-100, 100, 13),
          spin: random(-180, 180, 29),
          tumble: random(-100, 100, 47),
          depth: random(0.75, 1.25, 61),
          delay: row * 0.018 + random(0, 0.12, 73),
          duration: random(0.9, 1.45, 83),
        };
      });

      gsap.set(sortedFragments, {
        y: 0,
        x: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
        autoAlpha: 1,
        z: 0,
      });

      const fallTl = gsap.timeline();

      trajectories.forEach(
        ({ element, drift, spin, tumble, depth, delay, duration }) => {
          fallTl.to(
            element,
            {
              y: () => window.innerHeight + 120 + gsap.utils.random(0, 180),
              x: drift,
              z: () => gsap.utils.random(-100, 100),
              rotationX: tumble,
              rotationY: spin * 0.45,
              rotationZ: spin,
              scale: depth,
              autoAlpha: 0,
              duration,
              ease: "power2.in", // Gravity acceleration
            },
            delay,
          );
        },
      );

      tl.add(fallTl);

      // --- SCENE 3: Rose appears on transparent background ---
      // We wait until the blocks are mostly gone, then pulse the rose
      tl.to(
        rose,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.35,
          ease: "sine.out",
        },
        "-=0.25",
      );

      tl.to(rose, {
        scale: 1.08,
        duration: 0.4,
        ease: "sine.inOut",
        repeat: 3,
        yoyo: true,
      });

      tl.to(rose, {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.35,
        ease: "power2.inOut",
      });

      // Final cleanup: remove the preloader entirely
      tl.set(container, { pointerEvents: "none" });
      tl.set(container, { autoAlpha: 0 });
    }, container);

    return () => ctx.revert();
  }, [videoReady]);

  return (
    <div ref={containerRef} className="preloader-container">
      <div ref={contentRef} className="preloader-content">
        <div ref={monogramRef} className="preloader-monogram">
          BBH
        </div>

        <div ref={fragmentsRef} className="preloader-fragments">
          {fragments.map((fragment) => (
            <div
              key={fragment.id}
              className="fragment"
              data-row={fragment.row}
              data-col={fragment.col}
            />
          ))}
        </div>

        <div ref={roseRef} className="preloader-rose">
          <RoseMark />
        </div>
      </div>
    </div>
  );
};
