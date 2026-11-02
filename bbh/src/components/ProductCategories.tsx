import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProductCategories.css";

gsap.registerPlugin(ScrollTrigger);

interface Category {
  number: string;
  name: string;
  description: string;
  image: string;
  align: "left" | "right";
  size: "large" | "medium" | "small";
}

const categories: Category[] = [
  {
    number: "01",
    name: "Eco-Friendly Stationery",
    description:
      "Notebooks, pens and desk essentials made from recycled and natural materials that don't compromise on quality or feel.",
    image:
      "https://images.pexels.com/photos/8947691/pexels-photo-8947691.jpeg?auto=compress&cs=tinysrgb&w=1200",
    align: "left",
    size: "large",
  },
  {
    number: "02",
    name: "Sustainable Paper Products",
    description:
      "Recycled and responsibly sourced paper for printing, packaging and everyday office use.",
    image:
      "https://images.pexels.com/photos/8250903/pexels-photo-8250903.jpeg?auto=compress&cs=tinysrgb&w=1200",
    align: "right",
    size: "medium",
  },
  {
    number: "03",
    name: "Reusable Office Consumables",
    description:
      "Glass containers, refillable dispensers and durable alternatives to single-use items built to last.",
    image:
      "https://images.pexels.com/photos/3735188/pexels-photo-3735188.jpeg?auto=compress&cs=tinysrgb&w=1200",
    align: "left",
    size: "medium",
  },
  {
    number: "04",
    name: "Biodegradable Alternatives",
    description:
      "Compostable packaging, plant-based materials and products designed to return to the earth.",
    image:
      "https://images.pexels.com/photos/11348488/pexels-photo-11348488.jpeg?auto=compress&cs=tinysrgb&w=1200",
    align: "right",
    size: "large",
  },
  {
    number: "05",
    name: "Responsible Workplace Supplies",
    description:
      "From bamboo organisers to natural fibre cleaning products — everything your workplace needs, considered.",
    image:
      "https://images.pexels.com/photos/2587993/pexels-photo-2587993.jpeg?auto=compress&cs=tinysrgb&w=1200",
    align: "left",
    size: "small",
  },
];

export const ProductCategories = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const items = section.querySelectorAll<HTMLElement>(".category-item");
    const images = section.querySelectorAll<HTMLElement>(".category-image");
    const names = section.querySelectorAll<HTMLElement>(".category-name");
    const indicators = section.querySelectorAll<HTMLElement>(
      ".category-indicator-line",
    );

    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 });
      gsap.set(images, { clipPath: "none", scale: 1 });
      gsap.set(names, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        const img = item.querySelector<HTMLElement>(".category-image");
        const name = item.querySelector<HTMLElement>(".category-name");
        const num = item.querySelector<HTMLElement>(".category-number");
        const desc = item.querySelector<HTMLElement>(".category-description");

        gsap.set(img, { clipPath: "inset(0 100% 0 0)", scale: 1.1 });
        gsap.set(name, { opacity: 0, yPercent: 60 });
        gsap.set(num, { opacity: 0, x: -20 });
        gsap.set(desc, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(img, {
          clipPath: "inset(0 0% 0 0)",
          scale: 1.02,
          duration: 1,
          ease: "power2.out",
        })
          .to(num, { opacity: 1, x: 0, duration: 0.4 }, 0.2)
          .to(
            name,
            { opacity: 1, yPercent: 0, duration: 0.6, ease: "power2.out" },
            0.3,
          )
          .to(desc, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
      });

      // Subtle pointer parallax on images
      if (!window.matchMedia("(pointer: coarse)").matches) {
        images.forEach((img) => {
          const wrapper = img.closest<HTMLElement>(".category-image-wrapper");
          if (!wrapper) return;

          const onMouseMove = (e: MouseEvent) => {
            const rect = wrapper.getBoundingClientRect();
            const xRel = (e.clientX - rect.left) / rect.width - 0.5;
            const yRel = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(img, {
              x: xRel * 20,
              y: yRel * 20,
              duration: 0.8,
              ease: "power2.out",
            });
          };

          const onMouseLeave = () => {
            gsap.to(img, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
          };

          wrapper.addEventListener("mousemove", onMouseMove);
          wrapper.addEventListener("mouseleave", onMouseLeave);
        });
      }

      // Active indicator tracking
      indicators.forEach((line, idx) => {
        ScrollTrigger.create({
          trigger: items[idx],
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              indicators.forEach((l) =>
                l.classList.remove("category-indicator-line--active"),
              );
              line.classList.add("category-indicator-line--active");
            }
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="categories" className="product-categories">
      <div className="categories-header">
        <span className="categories-eyebrow">
          <span className="categories-eyebrow-dot" />
          03 — PRODUCT CATEGORIES
        </span>
        <h2 className="categories-title">
          A catalogue of
          <br />
          <em>considered</em> choices.
        </h2>
      </div>

      <div className="categories-indicator" aria-hidden="true">
        {categories.map((cat) => (
          <span key={cat.number} className="category-indicator-line" />
        ))}
      </div>

      <div className="categories-list">
        {categories.map((cat) => (
          <article
            key={cat.number}
            className={`category-item category-item--${cat.align} category-item--${cat.size}`}
          >
            <div className="category-image-wrapper" data-cursor="View">
              <img
                className="category-image"
                src={cat.image}
                alt={cat.name}
                loading="lazy"
              />
            </div>

            <div className="category-text">
              <span className="category-number">{cat.number}</span>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-description">{cat.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
