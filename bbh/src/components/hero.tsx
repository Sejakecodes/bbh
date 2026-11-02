import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import videoSource from "../assets/video/Sustainable_packaging_video_prod…_9a324431.mp4";
import "./HeroScrollVideo.css";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    eyebrow: "01 — NATURAL BY DESIGN",
    title: (
      <>
        Better choices.
        <br />
        Beautifully made.
      </>
    ),
    description:
      "Thoughtfully considered packaging for brands that care about what comes next.",
    label: "Herbal tea packaging",
  },
  {
    eyebrow: "02 — LESS, BUT BETTER",
    title: (
      <>
        A lighter touch.
        <br />A lasting impression.
      </>
    ),
    description:
      "From paper tapes to protective packaging, make every detail feel considered.",
    label: "Responsible packaging",
  },
  {
    eyebrow: "03 — MADE TO BE REUSED",
    title: (
      <>
        Carry your values
        <br />
        with you.
      </>
    ),
    description:
      "Reusable bags and purposeful materials that give everyday essentials a new perspective.",
    label: "Reusable essentials",
  },
  {
    eyebrow: "04 — THE FUTURE IS A CHOICE",
    title: (
      <>
        Make your brand
        <br />
        mean more.
      </>
    ),
    description:
      "Discover thoughtful branding and packaging solutions for a more considered world.",
    label: "Better Branding House",
  },
];

// 1. ADD THE PROP HERE
export default function HeroScrollVideo({
  onVideoReady,
}: {
  onVideoReady?: () => void;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekFrameRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const lastRequestedRef = useRef(-1);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video) return;

    let disposed = false;
    let context: gsap.Context | undefined;
    let trigger: ScrollTrigger | undefined;
    let previousPhase = -1;

    video.pause();

    const seekVideo = (time: number) => {
      targetTimeRef.current = time;

      if (seekFrameRef.current !== null) {
        cancelAnimationFrame(seekFrameRef.current);
      }

      seekFrameRef.current = requestAnimationFrame(() => {
        seekFrameRef.current = null;

        if (disposed || video.readyState < 2) return;

        const duration = Number.isFinite(video.duration) ? video.duration : 0;

        const nextTime = Math.max(0, Math.min(targetTimeRef.current, duration));

        if (
          Math.abs(video.currentTime - nextTime) < 0.015 ||
          Math.abs(lastRequestedRef.current - nextTime) < 0.015
        ) {
          return;
        }

        lastRequestedRef.current = nextTime;
        video.currentTime = nextTime;
      });
    };

    const setup = () => {
      if (disposed || trigger || !Number.isFinite(video.duration)) return;

      video.pause();
      video.currentTime = 0;
      const heroTextSelector =
        ".bbh-hero__eyebrow, .bbh-hero__title, .bbh-hero__description, .bbh-hero__cta, .bbh-hero__product";
      const startColor = [24, 39, 29];
      const endColor = [244, 245, 232];

      context = gsap.context(() => {
        trigger = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "+=350%",
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const progress = self.progress;

            container.style.setProperty(
              "--scroll-progress",
              `${progress * 100}%`,
            );

            seekVideo(progress * video.duration);

            const textFadeStart = 0.85;
            const fadeProgress = gsap.utils.clamp(
              0,
              1,
              (progress - textFadeStart) / (1 - textFadeStart),
            );
            const opacity = 1 - fadeProgress;
            gsap.set(container.querySelectorAll(heroTextSelector), {
              autoAlpha: opacity,
            });

            const backgroundColor = startColor.map((start, index) =>
              Math.round(start + (endColor[index] - start) * fadeProgress),
            );
            container.style.backgroundColor = `rgb(${backgroundColor.join(", ")})`;

            const nextPhase =
              progress < 0.22
                ? 0
                : progress < 0.48
                  ? 1
                  : progress < 0.74
                    ? 2
                    : 3;

            if (nextPhase !== previousPhase) {
              previousPhase = nextPhase;
              setActivePhase(nextPhase);
            }
          },
        });
      }, container);

      ScrollTrigger.refresh();
    };

    const onLoadedData = () => {
      setup();
      // 2. TRIGGER THE PRELOADER HERE
      if (onVideoReady) {
        onVideoReady();
      }
    };

    video.addEventListener("loadeddata", onLoadedData);

    // 3. FALLBACK: If the video is already cached and loaded instantly
    if (video.readyState >= 2) {
      onLoadedData();
    } else {
      video.load();
    }

    return () => {
      disposed = true;
      video.removeEventListener("loadeddata", onLoadedData);

      if (seekFrameRef.current !== null) {
        cancelAnimationFrame(seekFrameRef.current);
      }

      context?.revert();
      trigger?.kill();
    };
  }, [onVideoReady]); // Add onVideoReady to dependency array

  return (
    <section
      ref={containerRef}
      className="bbh-hero"
      aria-label="Better Branding House sustainable packaging"
    >
      <video
        ref={videoRef}
        className="bbh-hero__video"
        src={videoSource}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
      />

      <div className="bbh-hero__veil" />
      <div className="bbh-hero__grain" />

      <header className="bbh-hero__header">
        <a
          className="bbh-hero__brand"
          href="/"
          aria-label="Better Branding House home"
        >
          <span className="bbh-hero__monogram">BBH</span>
          <span className="bbh-hero__brand-name">
            BETTER BRANDING
            <span>HOUSE</span>
          </span>
        </a>

        <span className="bbh-hero__header-note">
          CONSIDERED MATERIALS. CONSCIOUS BRANDS.
        </span>

        <a className="bbh-hero__menu" href="#collection">
          EXPLORE COLLECTION <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="bbh-hero__content">
        <div className="bbh-hero__story" aria-live="polite">
          <span className="bbh-hero__eyebrow" key={`eyebrow-${activePhase}`}>
            <span className="bbh-hero__eyebrow-dot" />
            {phases[activePhase].eyebrow}
          </span>

          <h1 className="bbh-hero__title" key={`title-${activePhase}`}>
            {phases[activePhase].title}
          </h1>

          <p
            className="bbh-hero__description"
            key={`description-${activePhase}`}
          >
            {phases[activePhase].description}
          </p>

          <a className="bbh-hero__cta" href="#collection">
            <span>Discover our approach</span>
            <span className="bbh-hero__cta-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <aside className="bbh-hero__product">
          <span className="bbh-hero__product-label">IN FOCUS</span>
          <span className="bbh-hero__product-name">
            {phases[activePhase].label}
          </span>
          <span className="bbh-hero__product-index">
            0{activePhase + 1} <span>/</span> 04
          </span>
        </aside>
      </div>

      <footer className="bbh-hero__footer">
        <div className="bbh-hero__scroll-hint">
          <span className="bbh-hero__scroll-icon">↓</span>
          <span>SCROLL TO EXPLORE</span>
        </div>
        <div className="bbh-hero__progress" aria-hidden="true">
          <div className="bbh-hero__progress-fill" />
        </div>
        <span className="bbh-hero__footer-note">PACKAGING WITH PURPOSE</span>
      </footer>
    </section>
  );
}
