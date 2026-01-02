"use client";
import { Button } from "@/components/ui/button.jsx";
import React from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

const ScrollToTop = () => {
    const [visible, setVisible] = React.useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 500) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    React.useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const handleTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {visible && (
                <Button
                    isIconOnly
                    className="border border-white shadow-2xl transition duration-300 hover:-translate-y-1  w-[3.5rem] h-[3.5rem] flex items-center p-1 justify-center rounded-full fixed lg:bottom-12 bottom-8 lg:right-12 right-8 bg-primary z-[999] cursor-pointer"
                    onClick={handleTop}
                >
                    <AiOutlineArrowUp size={32} className="text-white" />
                </Button>
            )}
        </>
    );
};

export default ScrollToTop;
