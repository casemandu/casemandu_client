"use client";

import { useEffect, useState } from "react";

const SmoothScroll = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import Lenis only on client side
    let lenis;
    let rafId;

    const initSmoothScroll = async () => {
      try {
        const Lenis = (await import("lenis")).default;
        
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        });

        function raf(time) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      } catch (error) {
        console.warn("Failed to load smooth scroll:", error);
      }
    };

    initSmoothScroll();

    // Cleanup function
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;

