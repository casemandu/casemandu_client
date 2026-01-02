"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MdMenu } from "react-icons/md";
import CartContainer from "./CartContainer";
import SearchSidebar from "./SearchSidebar";

const Header = ({ setIsOpenCart, setIsMenuOpen }) => {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 0) {
        body.classList.remove("scroll-down");
        body.classList.remove("scroll-up");
        return;
      }

      if (
        currentScroll > lastScroll &&
        currentScroll > 300 &&
        !body.classList.contains("scroll-down")
      ) {
        body.classList.add("scroll-down");
        body.classList.add("scroll-down");
      }

      if (
        currentScroll < lastScroll &&
        body.classList.contains("scroll-down")
      ) {
        body.classList.remove("scroll-down");
        body.classList.add("scroll-up");
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="bg-black text-white top-0 left-0 sticky z-50 w-full transition shadow-md">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div>
            <Link className="text-3xl" href={"/"}>
              <Image
                src="/images/logo/logo.png" 
                alt="Casemandu Logo"
                className="w-auto h-[90px] object-contain cursor-pointer transition-opacity hover:opacity-90"
                width={200}
                height={50}
              />
            </Link>
          </div>

          <div className="hidden md:flex gap-4 items-center text-sm font-medium text-nowrap  py-4">
            <Link
              className={`px-3 py-2 capitalize rounded-md transition-all duration-200 ${
                pathname === "/shop"
                  ? "text-white bg-white/10 font-semibold rounded-md"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
              href="/shop"
            >
              Products
            </Link>
            
            <Link
              className={`px-3 py-2 capitalize text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200 `}
              href= {process.env.NEXT_PUBLIC_CUSTOMIZE_LINK }
              target="_blank"
            >
              Customise
            </Link>
            <Link
              className={`px-3 py-2 capitalize rounded-md transition-all duration-200 ${
                pathname === "/offers"
                  ? "text-white bg-white/10 font-semibold rounded-md"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
              href="/offers"
            >
              Offers
            </Link>
            <Link
              className={`px-3 py-2 capitalize rounded-md transition-all duration-200 ${
                pathname === "/order/track"
                  ? "text-white bg-white/10 font-semibold rounded-md"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
              href="/order/track"
            >
              Track Order
            </Link>
          </div>
          <div className="flex gap-3 items-center justify-end flex-shrink-0  py-4">
            {/* Search Sidebar - Desktop & Mobile */}
            {pathname !== "/checkout" && <SearchSidebar />}

            {/* Cart */}
            {pathname !== "/checkout" && <CartContainer />}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-300 hover:text-white transition-colors flex-shrink-0"
              type="button"
              onClick={() => setIsMenuOpen(true)}
            >
              <MdMenu className="h-6 w-6 mt-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
