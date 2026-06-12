import Link from "next/link";
import type { Locale } from "@/lib/locales";

type Dict = {
  location: string;
  contattiStaff: string;
  rights: string;
};

export default function Footer({
  dict,
  lang,
}: {
  dict: Dict;
  lang: Locale;
}) {
  return (
    <footer className="bg-surface-container-low w-full border-t border-outline-variant">
      <div className="w-full py-20 px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-base">
          <span className="text-headline-md font-semibold text-primary tracking-tighter">
            CORLEONE GUESTHOUSE
          </span>
          <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mt-4">
            © {new Date().getFullYear()} CORLEONE GUESTHOUSE. {dict.rights}
          </p>
        </div>

        <nav className="flex flex-col gap-base">
          <Link
            href={`/${lang}/location`}
            className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            {dict.location}
          </Link>
        </nav>

        <nav className="flex flex-col gap-base">
          <Link
            href={`/${lang}/contatti`}
            className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            {dict.contattiStaff}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
