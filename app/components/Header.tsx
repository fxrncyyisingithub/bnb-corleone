"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { localeLabels } from "@/lib/locales";
import type { Locale } from "@/lib/locales";

type Dict = {
  home: string;
  camere: string;
  cosaVisitare: string;
  location: string;
  contatti: string;
  prenotaOra: string;
  openMenu: string;
  closeMenu: string;
};

export default function Header({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dict;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const navLinks = useMemo(
    () => [
      { href: `/${lang}`, label: dict.home },
      { href: `/${lang}/camere`, label: dict.camere },
      { href: `/${lang}/cosa-visitare`, label: dict.cosaVisitare },
      { href: `/${lang}/location`, label: dict.location },
      { href: `/${lang}/contatti`, label: dict.contatti },
    ],
    [lang, dict.home, dict.camere, dict.cosaVisitare, dict.location, dict.contatti]
  );

  const pathWithoutLang =
    "/" + pathname.split("/").slice(2).join("/");

  const moveTo = useCallback(
    (href: string | null) => {
      const target = href || navLinks.find((l) => l.href === pathname)?.href;
      const el = target ? linkRefs.current.get(target) : null;
      if (el && navRef.current) {
        const parentRect = navRef.current.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setIndicator((prev) => {
          const next = {
            left: elRect.left - parentRect.left,
            width: elRect.width,
          };
          if (prev.left === next.left && prev.width === next.width) return prev;
          return next;
        });
      }
    },
    [pathname, navLinks]
  );

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

  const locales: Locale[] = ["it", "en", "de"];

  return (
    <>
      <header className="bg-surface fixed top-0 w-full z-50 flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop border-b border-outline-variant">
        <Link
          href={`/${lang}`}
          className="text-headline-md font-bold text-primary tracking-tighter"
        >
          CORLEONE GUESTHOUSE
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1">
            {locales.map((l) => (
              <Link
                key={l}
                href={pathWithoutLang === "/" ? `/${l}` : `/${l}${pathWithoutLang}`}
                className={`px-2 py-1 text-label-sm uppercase tracking-widest transition-colors ${
                  l === lang
                    ? "text-primary font-semibold"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-primary hover:opacity-70 transition-opacity duration-300 active:scale-95"
            onClick={() => setMenuOpen(true)}
            aria-label={dict.openMenu}
          >
            <Menu className="w-6 h-6" aria-hidden />
          </button>
        </div>

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
            href={`/${lang}/camere`}
            className="bg-primary text-on-primary px-6 py-3 text-label-sm uppercase tracking-widest hover:opacity-70 transition-opacity duration-300"
          >
            {dict.prenotaOra}
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
            aria-label={dict.closeMenu}
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

        <div className="flex justify-center gap-4 py-6 border-t border-outline-variant">
          {locales.map((l) => (
            <Link
              key={l}
              href={pathWithoutLang === "/" ? `/${l}` : `/${l}${pathWithoutLang}`}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-1 text-label-sm uppercase tracking-widest transition-colors ${
                l === lang
                  ? "text-primary font-semibold border-b border-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {localeLabels[l]}
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <Link
            href={`/${lang}/camere`}
            onClick={() => setMenuOpen(false)}
            className="block w-full py-4 bg-primary text-on-primary text-center text-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            {dict.prenotaOra}
          </Link>
        </div>
      </div>
    </>
  );
}
