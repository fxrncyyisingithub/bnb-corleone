import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full border-t border-outline-variant">
      <div className="w-full py-20 px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-[1280px] mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-base">
          <span className="text-headline-md font-semibold text-primary tracking-tighter">
            CORLEONE GUESTHOUSE
          </span>
          <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mt-4">
            © {new Date().getFullYear()} CORLEONE GUESTHOUSE. ALL RIGHTS
            RESERVED.
          </p>
        </div>

        {/* Legal Links */}
        <nav className="flex flex-col gap-base">
          <Link
            href="#"
            className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Termini e Condizioni
          </Link>
          <Link
            href="#"
            className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Location
          </Link>
        </nav>

        {/* Contact Link */}
        <nav className="flex flex-col gap-base">
          <Link
            href="/contatti"
            className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Contatti Staff
          </Link>
        </nav>
      </div>
    </footer>
  );
}
