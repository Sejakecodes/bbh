import { useState, useEffect, useCallback } from "react";
import HeroScrollVideo from "./components/hero";
import ProductReveal from "./components/ProductReveal";
import { Preloader } from "./components/Preloader";
import { Navigation } from "./components/Navigation";
import { CustomCursor } from "./components/CustomCursor";
import { BrandStory } from "./components/BrandStory";
import { Manifesto } from "./components/Manifesto";
import { ProductCategories } from "./components/ProductCategories";
import { WhySustainable } from "./components/WhySustainable";
import { BusinessSolutions } from "./components/BusinessSolutions";
import { Impact } from "./components/Impact";
import { FinalCTA } from "./components/FinalCTA";
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
      <CustomCursor />
      <Navigation />

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

        {/* 3. Brand Story / About — pinned editorial with word masks */}
        <BrandStory />

        {/* 4. Sustainability Manifesto — scroll-controlled typography */}
        <Manifesto />

        {/* 5. Product Categories — asymmetric editorial gallery */}
        <ProductCategories />

        {/* 6. Why Choose Sustainable — comparison storytelling */}
        <WhySustainable />

        {/* 7. Business Solutions — horizontal scroll composition */}
        <BusinessSolutions />

        {/* 8. Impact / Sustainability Values — SVG path drawing */}
        <Impact />

        {/* 9. Final CTA — deep forest-green closing */}
        <FinalCTA />
      </main>
    </div>
  );
}

export default App;
