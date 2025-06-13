"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 200); // Show button after scrolling 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/4915566389194", "_blank");
  };

  return <div className="fixed bottom-4 right-4 flex space-x-4"></div>;
}
