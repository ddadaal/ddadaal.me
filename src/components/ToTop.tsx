"use client";
import { useEffect, useRef } from "react";
import { FaArrowUp } from "react-icons/fa";

export const ToTop = () => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = () => {
      if (btnRef.current) {
        if (window.scrollY > 10) {
          btnRef.current.classList.remove("hidden");
        }
        else {
          btnRef.current.classList.add("hidden");
        }
      }
    };

    if (btnRef.current) {
      window.addEventListener("scroll", handler);
      return () => {
        window.removeEventListener("scroll", handler);
      };
    }
  }, [btnRef.current]);

  return (
    <button
      ref={btnRef}
      className="fixed animate-slide-up bottom-8 right-8 z-50 p-3 rounded-full bg-base-300 text-base-content shadow"
      title="To top"
      onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}
    >
      <FaArrowUp className="w-6 h-6" />
    </button>
  );
};
