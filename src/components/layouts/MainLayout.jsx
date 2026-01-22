"use client";
import React, { Suspense, useState, useEffect } from "react";
import { Toaster } from "sonner";
import Header from "@/components/common/headers/Header";
import MobileMenuDrawer from "@/components/common/headers/MobileMenuDrawer";
import Footer from "@/components/common/footers/Footer";
import ReduxProvider from "@/providers/ReduxProvider";
import Promocodes from "@/components/common/promocodes/Promocodes";
import SmoothScroll from "@/components/common/SmoothScroll";

const MainLayout = ({ children }) => {
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isPromocodes, setIsPromocodes] = useState(true);

  // Initialize dynamic viewport height for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)
    
    // Also update on visual viewport changes (mobile browser address bar)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setVH)
    }

    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setVH)
      }
    }
  }, [])
  return (
    <Suspense>
      <ReduxProvider>
        <SmoothScroll>
          {isPromocodes && (
            <Promocodes
              isPromocodes={isPromocodes}
              setIsPromocodes={setIsPromocodes}
            />
          )}
          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={3000}
          />
          <Header setIsOpenCart={setIsOpenCart} setIsMenuOpen={setIsMenuOpen} />
          {children}
          <MobileMenuDrawer
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
          <Footer />
        </SmoothScroll>
      </ReduxProvider>
    </Suspense>
  );
};

export default MainLayout;
