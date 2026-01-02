"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileMenuDrawer = ({ isMenuOpen, setIsMenuOpen }) => {
  const pathname = usePathname();
  return (
    <main
      className={`fixed overflow-hidden z-50 bg-black bg-opacity-25 inset-0 transform ease-in-out transition-all ${
        isMenuOpen
          ? "opacity-100 duration-100 translate-x-0"
          : "opacity-0 -translate-x-full"
      }`}
    >
      <section
        className={
          "w-[380px] left-0 absolute bg-white h-full shadow-xl duration-100 ease-in-out transition-all transform" +
          (isMenuOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <article className="relative p-3 border-none flex flex-col h-screen">
          <Link
            className="text-3xl text-center"
            href="/"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/images/logo/logo.png"
              alt="Casemandu Logo"
              className="m-auto h-20 object-contain cursor-pointer"
              width={150}
              height={50}
            />
          </Link>
          <div className="flex flex-col mt-6 gap-1 items-stretch px-2 overflow-y-auto">
            <Link
              className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === "/"
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              href="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === "/shop"
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            
            <Link
              className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === "/offers"
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              href="/offers"
              onClick={() => setIsMenuOpen(false)}
            >
              Offers
            </Link>

            <Link
              className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === "https://customize.casemandu.com.np"
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              href="https://customize.casemandu.com.np"
              target="_blank"
              onClick={() => setIsMenuOpen(false)}
            >
              Customise
            </Link>

            <Link
              className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === "/order/track"
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              href="/order/track"
              onClick={() => setIsMenuOpen(false)}
            >
              Track Order
            </Link>
          </div>
        </article>
      </section>
      <section
        className="w-screen h-full"
        onClick={() => {
          setIsMenuOpen(false);
        }}
      ></section>
    </main>
  );
};

export default MobileMenuDrawer;
