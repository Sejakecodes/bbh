import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./BusinessSolutions.css";

gsap.registerPlugin(ScrollTrigger);

interface Audience {
  number: string;
  title: string;
  description: string;
  image: string;
}

const audiences: Audience[] = [
  {
    number: "01",
    title: "Corporate Offices",
    description:
      "Large-scale supply programmes for corporate headquarters and multinational workspaces. We integrate with your procurement systems to deliver sustainable consumables at volume.",
    image:
      "https://images.pexels.com/photos/5511099/pexels-photo-5511099.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    number: "02",
    title: "Small & Medium Businesses",
    description:
      "Flexible ordering and tailored product selections for growing businesses. Practical sustainability without the complexity of enterprise procurement.",
    image:
      "https://images.pexels.com/photos/7511754/pexels-photo-7511754.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    number: "03",
    title: "Educational Institutions",
    description:
      "Stationery, paper and classroom supplies for schools, colleges and universities. Help students learn in environments that reflect the values you teach.",
    image:
      "https://images.pexels.com/photos/7319228/pexels-photo-7319228.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    number: "04",
    title: "Organisations & NGOs",
    description:
      "For mission-driven organisations, every purchasing decision matters. We help you align your office supplies with your organisational values.",
    image:
      "https://images.pexels.com/photos/7511748/pexels-photo-7511748.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export const BusinessSolutions = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const panels = track.querySelectorAll<HTMLElement>(".audience-panel");
    const images = track.querySelectorAll<HTMLElement>(".audience-image");
    const titles = track.querySelectorAll<HTMLElement>(".audience-title");
    const activeIndicator = section.querySelector<HTMLElement>(
      ".solutions-active-indicator",
    );

    if (reduced) {
      gsap.set(track, { x: 0 });
      gsap.set(images, { clipPath: "none", opacity: 1 });
      gsap.set(titles, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 900;

      if (isMobile) {
        // On mobile, stack vertically — no horizontal scroll
        gsap.set(track, { display: "flex", flexDirection: "column", x: 0 });
        gsap.set(images, { clipPath: "none", opacity: 1 });
        gsap.set(titles, { opacity: 1, y: 0 });
        panels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: panel,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
        return;
      }

      // Desktop: horizontal scroll controlled by vertical scroll
      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.set(images, { clipPath: "inset(0 100% 0 0)", scale: 1.1 });
      gsap.set(titles, { opacity: 0, yPercent: 50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, { x: () => -totalScroll, duration: 1, ease: "none" }, 0);

      // Reveal images and titles as they enter
      panels.forEach((_, idx) => {
        const startProgress = idx / panels.length;

        tl.to(
          images[idx],
          {
            clipPath: "inset(0 0% 0 0)",
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          },
          startProgress,
        );
        tl.to(
          titles[idx],
          { opacity: 1, yPercent: 0, duration: 0.2, ease: "power2.out" },
          startProgress + 0.05,
        );
      });

      // Active indicator
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${totalScroll}`,
        onUpdate: (self) => {
          if (activeIndicator) {
            const idx = Math.min(
              Math.floor(self.progress * panels.length),
              panels.length - 1,
            );
            activeIndicator.textContent = `0${idx + 1} / 0${panels.length}`;
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="solutions" className="business-solutions">
      <div className="solutions-header">
        <span className="solutions-eyebrow">
          <span className="solutions-eyebrow-dot" />
          04 — WHO WE SERVE
        </span>
        <h2 className="solutions-title">
          Business solutions for
          <br />
          <em>every</em> workplace.
        </h2>
        <span className="solutions-active-indicator">01 / 04</span>
      </div>

      <div className="solutions-track-wrapper">
        <div ref={trackRef} className="solutions-track">
          {audiences.map((aud) => (
            <article key={aud.number} className="audience-panel">
              <div className="audience-image-wrapper">
                <img
                  className="audience-image"
                  src={aud.image}
                  alt={aud.title}
                  loading="lazy"
                />
              </div>
              <div className="audience-text">
                <span className="audience-number">{aud.number}</span>
                <h3 className="audience-title">{aud.title}</h3>
                <p className="audience-description">{aud.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
