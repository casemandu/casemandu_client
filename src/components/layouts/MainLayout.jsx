"use client";
import React, { Suspense, useState } from "react";
import { Toaster } from "react-hot-toast";
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
          <Toaster />
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
