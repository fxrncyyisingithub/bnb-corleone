"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/camere", label: "Camere" },
  { href: "/cosa-visitare", label: "Cosa Visitare" },
  { href: "/contatti", label: "Contatti" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const moveTo = useCallback((href: string | null) => {
    const target = href || navLinks.find((l) => l.href === pathname)?.href;
    const el = target ? linkRefs.current.get(target) : null;
    if (el && navRef.current) {
      const parentRect = navRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({ left: elRect.left - parentRect.left, width: elRect.width });
    }
  }, [pathname]);

  useEffect(() => {
    moveTo(null);
  }, [moveTo]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="bg-surface fixed top-0 w-full z-50 flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop border-b border-outline-variant">
        <Link
          href="/"
          className="text-headline-md font-bold text-primary tracking-tighter"
        >
          CORLEONE GUESTHOUSE
        </Link>

        <button
          className="md:hidden text-primary hover:opacity-70 transition-opacity duration-300 active:scale-95"
          onClick={() => setMenuOpen(true)}
          aria-label="Apri menu"
        >
          <Menu className="w-6 h-6" aria-hidden />
        </button>

        <nav ref={navRef} className="hidden md:flex gap-8 items-center relative">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              ref={(el) => {
                if (el) linkRefs.current.set(link.href, el);
              }}
              href={link.href}
              onMouseEnter={() => moveTo(link.href)}
              onMouseLeave={() => moveTo(null)}
              className={`text-body-md uppercase tracking-widest py-1 transition-colors active:scale-95 ${
                pathname === link.href
                  ? "text-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span
            className="absolute -bottom-px h-px bg-primary transition-all duration-300 ease-out pointer-events-none"
            style={{ left: indicator.left, width: indicator.width }}
          />
          <Link
            href="/camere"
            className="bg-primary text-on-primary px-6 py-3 text-label-sm uppercase tracking-widest hover:opacity-70 transition-opacity duration-300"
          >
            Prenota Ora
          </Link>
        </nav>
      </header>

      <div
        className={`fixed inset-0 bg-surface z-50 flex flex-col pt-20 px-margin-mobile pb-10 transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-0 left-0 w-full flex justify-between items-center h-20 px-margin-mobile border-b border-outline-variant">
          <span className="text-headline-md font-bold text-primary tracking-tighter">
            CORLEONE GUESTHOUSE
          </span>
          <button
            className="text-primary hover:opacity-70 transition-opacity duration-300 active:scale-95"
            onClick={() => setMenuOpen(false)}
            aria-label="Chiudi menu"
          >
            <X className="w-6 h-6" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center gap-8 mt-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-headline-lg-mobile uppercase tracking-widest self-start ${
                pathname === link.href
                  ? "text-primary border-b border-primary pb-1"
                  : "text-secondary hover:text-primary transition-colors"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <Link
            href="/camere"
            onClick={() => setMenuOpen(false)}
            className="block w-full py-4 bg-primary text-on-primary text-center text-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Prenota Ora
          </Link>
        </div>
      </div>
    </>
  );
}
