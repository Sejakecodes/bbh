import { useEffect, useRef, useState } from "react";
import "./Navigation.css";

interface NavLink {
  label: string;
  href: string;
}

const links: NavLink[] = [
  { label: "About", href: "#story" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Products", href: "#categories" },
  { label: "Solutions", href: "#solutions" },
  { label: "Impact", href: "#impact" },
  { label: "Contact", href: "#cta" },
];

export const Navigation = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`nav-bar ${scrolled ? "nav-bar--scrolled" : ""}`}
      >
        <a href="/" className="nav-brand" aria-label="Botshelo Bophelo Holdings">
          <span className="nav-monogram">BBH</span>
          <span className="nav-brand-text">
            BOTSHELO BOPHELO
            <span>HOLDINGS</span>
          </span>
        </a>

        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={activeSection === link.href ? "nav-link--active" : ""}
              >
                {link.label}
                <span className="nav-link-dot" />
              </a>
            </li>
          ))}
        </ul>

        <a href="#cta" className="nav-cta">
          Enquire <span aria-hidden="true">→</span>
        </a>

        <button
          className="nav-burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`nav-burger-line ${menuOpen ? "line-1--open" : ""}`} />
          <span className={`nav-burger-line ${menuOpen ? "line-2--open" : ""}`} />
        </button>
      </nav>

      <div className={`nav-mobile-menu ${menuOpen ? "nav-mobile-menu--open" : ""}`}>
        <ul>
          {links.map((link, i) => (
            <li
              key={link.href}
              style={{ transitionDelay: menuOpen ? `${i * 70 + 200}ms` : "0ms" }}
              className={menuOpen ? "nav-mobile-item--visible" : ""}
            >
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-mobile-num">
                  0{i + 1}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#cta"
          className="nav-mobile-cta"
          onClick={() => setMenuOpen(false)}
        >
          Enquire with us
        </a>
      </div>
    </>
  );
};
