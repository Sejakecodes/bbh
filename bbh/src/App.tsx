import { useState, useEffect, useCallback } from "react";
import HeroScrollVideo from "./components/hero";
import ProductReveal from "./components/ProductReveal";
import { Preloader } from "./components/Preloader";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoading]);

  return (
    <div className="app-container">
      {isLoading && (
        <Preloader
          videoReady={videoReady}
          onComplete={() => setIsLoading(false)}
        />
      )}

      <main>
        {/* 1. The Cinematic Scroll Video Hero */}
        <HeroScrollVideo onVideoReady={handleVideoReady} />

        {/* 2. The Cinematic Product Reveal */}
        <ProductReveal />

        {/* 3. The Collection Section (Target for the CTA) */}
        <section
          id="collection"
          style={{
            height: "100vh",
            backgroundColor: "#f6f3e9",
            color: "#203c2c",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 style={{ fontSize: "3rem", fontFamily: "Georgia, serif" }}>
            The Collection
          </h2>
          <p style={{ marginTop: "1rem" }}>More sustainable content below.</p>
        </section>
        
        {/* 4. Contact Section (Target for the Primary CTA) */}
        <section
          id="contact"
          style={{
            height: "50vh",
            backgroundColor: "#203c2c",
            color: "#f4f5e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontFamily: "Georgia, serif" }}>
            Let's build something better.
          </h2>
        </section>
      </main>
    </div>
  );
}

export default App;