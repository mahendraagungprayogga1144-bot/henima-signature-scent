"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const initObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
      );

      const elements = document.querySelectorAll("[data-reveal]");
      elements.forEach((el) => {
        el.classList.remove("is-visible");
        observer.observe(el);
      });

      return observer;
    };

    const observer = initObserver();

    // Re-init setelah page transition
    const timeout = setTimeout(() => {
      observer.disconnect();
      initObserver();
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
