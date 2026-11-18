"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";

type NavUser = {
  id?: string;
  role?: string;
  name?: string;
  email?: string;
} | null;

/**
 * Loads session on the client so root layout/pages can stay cacheable for SEO crawlers.
 */
export default function NavbarWrapper() {
  const [user, setUser] = useState<NavUser>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "same-origin" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const nextUser = data?.user ?? null;
        setUser(nextUser);
        if (pathname === "/" && nextUser?.role === "admin") {
          router.replace("/admin");
        } else if (pathname === "/" && nextUser?.role === "reseller") {
          router.replace("/shop");
        }
      } catch {
        /* anonymous visitors / crawlers — fine */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return <Navbar user={user} />;
}
