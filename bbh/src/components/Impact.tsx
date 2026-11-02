import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import "./Impact.css";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

interface Value {
  number: string;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    number: "01",
    title: "Responsible Purchasing",
    description:
      "Every order placed through Botshelo Bophelo Holdings is a deliberate choice for better materials and better suppliers.",
  },
  {
    number: "02",
    title: "Reusable Products",
    description:
      "We prioritise products designed to be used again and again, reducing the cycle of single-use waste in the workplace.",
  },
  {
    number: "03",
    title: "Reduced Unnecessary Waste",
    description:
      "Our product selection favours items with minimal, recyclable or compostable packaging — less waste before it even arrives.",
  },
  {
    number: "04",
    title: "Conscious Consumption",
    description:
      "We help organisations understand what they buy and why, encouraging procurement that is thoughtful rather than automatic.",
  },
  {
    number: "05",
    title: "Sustainable Alternatives",
    description:
      "For every conventional office product, there is a better option. Our catalogue exists to make that alternative easy to find.",
  },
];

export const Impact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const paths = section.querySelectorAll<SVGPathElement>(".impact-svg-path");
    const dot = section.querySelector<HTMLElement>(".impact-path-dot");
    const valueItems = section.querySelectorAll<HTMLElement>(".impact-value");
    const heading = section.querySelector<HTMLElement>(".impact-heading");

    if (reduced) {
      gsap.set(paths, { drawSVG: "100%" });
      gsap.set(valueItems, { opacity: 1, y: 0 });
      gsap.set(dot, { opacity: 1 });
      gsap.set(heading, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Prepare SVG paths for drawing animation
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      gsap.set(valueItems, { opacity: 0, y: 40 });
      gsap.set(dot, { opacity: 0 });
      gsap.set(heading, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 40%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Heading
      tl.to(heading, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });

      // SVG path drawing
      tl.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.3,
          ease: "power2.inOut",
        },
        "-=0.3",
      );

      // Dot follows the path
      tl.to(
        dot,
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        "-=1.2",
      );

      tl.to(
        dot,
        {
          motionPath: {
            path: paths[0],
            align: paths[0],
            alignOrigin: [0.5, 0.5],
          },
          duration: 1.5,
          ease: "power2.inOut",
        },
        "-=1.2",
      );

      // Value items reveal progressively
      tl.to(
        valueItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=1",
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="impact" className="impact">
      <div className="impact-inner">
        <div className="impact-header">
          <span className="impact-eyebrow">
            <span className="impact-eyebrow-dot" />
            05 — OUR VALUES
          </span>
          <h2 className="impact-heading">
            What we stand for,
            <br />
            <em>in practice.</em>
          </h2>
        </div>

        <div className="impact-body">
          <div className="impact-visual" aria-hidden="true">
            <svg
              viewBox="0 0 300 400"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                className="impact-svg-path"
                d="M150 380 Q150 300 150 250 Q100 220 80 180 Q80 130 130 110 Q170 100 190 70 Q180 40 140 30"
                stroke="#c8d8b0"
                strokeWidth="1.5"
                fill="none"
                opacity="0.8"
              />
              <path
                className="impact-svg-path"
                d="M130 110 Q90 95 80 70"
                stroke="#4a6b3a"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
              <path
                className="impact-svg-path"
                d="M190 70 Q220 55 230 30"
                stroke="#4a6b3a"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
              <circle cx="140" cy="30" r="5" fill="#c8d8b0" opacity="0.6" />
              <circle cx="150" cy="380" r="4" fill="#4a6b3a" opacity="0.5" />
            </svg>
            <div className="impact-path-dot" />
          </div>

          <div className="impact-values">
            {values.map((val) => (
              <article key={val.number} className="impact-value">
                <span className="impact-value-number">{val.number}</span>
                <div>
                  <h3 className="impact-value-title">{val.title}</h3>
                  <p className="impact-value-desc">{val.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
