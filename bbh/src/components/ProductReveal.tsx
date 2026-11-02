import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProductReveal.css";

// Import your images (Adjust paths based on your folder structure)
import imgLid from "../assets/products/product-lid.png";
import imgAngle from "../assets/products/product-angle.png";
import imgSide from "../assets/products/product-side.png";
import imgOpen from "../assets/products/product-open.png";
import imgUpright from "../assets/products/product-upright.png";
import imgHero from "../assets/products/product-hero.png";

gsap.registerPlugin(ScrollTrigger);

interface Scene {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  img: string;
  bg: string;
  color: string;
}

const scenes: Scene[] = [
  {
    id: "scene-1",
    eyebrow: "BETTER BRANDING. BETTER CHOICES.",
    title: "Packaging with a lighter footprint.",
    copy: "Thoughtfully considered packaging can help brands make more responsible choices without compromising the experience.",
    img: imgLid,
    bg: "#F4F5E8",
    color: "#203C2C",
  },
  {
    id: "scene-2",
    eyebrow: "02 — THE MATERIAL",
    title: "Let the material tell the story.",
    copy: "Choosing materials with a lower environmental impact can help reduce reliance on conventional packaging materials.",
    img: imgAngle,
    bg: "#e8dfce",
    color: "#203C2C",
  },
  {
    id: "scene-3",
    eyebrow: "03 — DESIGNED WITH PURPOSE",
    title: "Designed to make a difference.",
    copy: "Packaging is part of your brand experience. Thoughtful material selection and practical design can help reduce unnecessary material use.",
    img: imgSide,
    bg: "#F4F5E8",
    color: "#203C2C",
  },
  {
    id: "scene-4",
    eyebrow: "04 — THE REVEAL",
    title: "Less waste. More intention.",
    copy: "Reusable, recyclable, or compostable packaging may offer environmental benefits when it suits the product and is supported by the right systems.",
    img: imgOpen,
    bg: "#DCE8C8",
    color: "#203C2C",
  },
  {
    id: "scene-5",
    eyebrow: "05 — THE COMPLETE PRODUCT",
    title: "Your values, made visible.",
    copy: "Give customers a tangible expression of your brand's commitment to more considered packaging choices.",
    img: imgUpright,
    bg: "#C8D8B0",
    color: "#203C2C",
  },
  {
    id: "scene-6",
    eyebrow: "THE BETTER BRANDING HOUSE",
    title: "Make a better impression.",
    copy: "Build a brand experience that looks good, feels considered, and takes environmental responsibility seriously.",
    img: imgHero,
    bg: "#203C2C",
    color: "#F4F5E8",
  },
];

const ProductReveal: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 901px)",
        mobile: "(max-width: 900px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const conditions = context.conditions as {
          desktop: boolean;
          mobile: boolean;
          reduceMotion: boolean;
        };

        const layers = gsap.utils.toArray<HTMLElement>(
          container.querySelectorAll(".scene-layer"),
        );
        const images = gsap.utils.toArray<HTMLElement>(
          container.querySelectorAll(".scene-image"),
        );
        const texts = gsap.utils.toArray<HTMLElement>(
          container.querySelectorAll(".scene-text"),
        );

        // --- REDUCED MOTION FALLBACK ---
        if (conditions.reduceMotion) {
          gsap.set(layers, {
            position: "relative",
            inset: "auto",
            opacity: 1,
            pointerEvents: "auto",
            marginBottom: "10vh", // Space out scenes
          });
          gsap.set(container, { height: "auto", overflow: "visible" });
          gsap.set(images, { autoAlpha: 1, clearProps: "transform,clipPath" });
          gsap.set(texts, { autoAlpha: 1, clearProps: "transform" });
          return;
        }

        // --- INITIAL STATES FOR SCROLL ANIMATION ---
        gsap.set(layers, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(layers[0], { autoAlpha: 1, pointerEvents: "auto" });

        gsap.set(images, {
          autoAlpha: 0,
          scale: 1.08,
          yPercent: 4,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        gsap.set(images[0], { autoAlpha: 1, scale: 1, yPercent: 0 });

        gsap.set(texts, { autoAlpha: 0, y: 28 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });

        gsap.set(container, { backgroundColor: scenes[0].bg });

        const introTween = gsap.fromTo(
          container,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        // --- MASTER TIMELINE ---
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () =>
              `+=${window.innerHeight * (conditions.desktop ? 5 : 5.5)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        scenes.forEach((scene, index) => {
          if (index === 0) return;

          const previousLayer = layers[index - 1];
          const currentLayer = layers[index];
          const previousImage = images[index - 1];
          const currentImage = images[index];
          const previousText = texts[index - 1];
          const currentText = texts[index];

          const label = `scene-${index + 1}`;
          tl.addLabel(label);

          // 1. Text out
          tl.to(previousText, { autoAlpha: 0, y: -24, duration: 0.35 }, label);

          // 2. Image out
          tl.to(
            previousImage,
            { scale: 0.94, yPercent: -3, autoAlpha: 0, duration: 0.6 },
            label,
          );

          // 3. Background shift
          tl.to(
            container,
            { backgroundColor: scene.bg, duration: 0.7 },
            `${label}+=0.1`,
          );

          // 4. Reveal incoming image mask
          tl.set(
            currentLayer,
            { autoAlpha: 1, pointerEvents: "none" },
            `${label}+=0.15`,
          );

          tl.fromTo(
            currentImage,
            {
              autoAlpha: 1,
              scale: 1.08,
              yPercent: 4,
              clipPath: "inset(0% 0% 100% 0%)",
            },
            {
              autoAlpha: 1,
              scale: 1,
              yPercent: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.8,
              ease: "power2.out",
            },
            `${label}+=0.15`,
          );

          // 5. Reveal incoming text
          tl.fromTo(
            currentText,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.45 },
            `${label}+=0.45`,
          );

          // 6. Enable pointer events for last scene
          tl.set(
            currentLayer,
            { pointerEvents: index === scenes.length - 1 ? "auto" : "none" },
            `${label}+=0.9`,
          );

          // 7. Hold
          tl.to({}, { duration: 0.45 });
        });

        return () => {
          introTween.scrollTrigger?.kill();
          introTween.kill();
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={containerRef} className="product-reveal-container">
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          className={`scene-layer scene-${index + 1}`}
          style={{ color: scene.color }}
        >
          <div className="scene-content">
            <div className="scene-text">
              <span className="scene-eyebrow">{scene.eyebrow}</span>
              <h2 className="scene-title">{scene.title}</h2>
              <p className="scene-copy">{scene.copy}</p>

              {index === scenes.length - 1 && (
                <div className="scene-ctas">
                  <a href="#contact" className="btn-primary">
                    Let's build something better
                  </a>
                  <a href="#solutions" className="btn-secondary">
                    Explore our solutions
                  </a>
                </div>
              )}
            </div>

            <div className="scene-image-wrapper">
              <img src={scene.img} alt={scene.title} className="scene-image" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProductReveal;
