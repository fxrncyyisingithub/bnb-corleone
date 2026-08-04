import type { Metadata } from "next";
import { CONTACTS } from "@/lib/contacts";
import WhatsAppIcon from "@/app/components/WhatsAppIcon";
import { User } from "lucide-react";
import { localeMetadata, resolveLocalePage, type LocaleParams } from "@/lib/page-locale";
import MobileContatti from "@/app/components/mobile/Contatti";

export function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  return localeMetadata(params, (dict) => ({ title: dict.contatti.title }));
}

export default async function Contatti({ params }: { params: LocaleParams }) {
  const { dict, isMobile } = await resolveLocalePage(params);

  if (isMobile) {
    return <MobileContatti dict={dict.contatti} />;
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-20 flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h1 className="text-headline-lg font-bold text-primary">{dict.contatti.title}</h1>
      </section>

      <div className="grid grid-cols-2 gap-6">
        {CONTACTS.map((contact) => (
          <section
            key={contact.phone}
            className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-high shrink-0 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" aria-hidden />
              </div>
              <div>
                <h2 className="text-[20px] font-semibold text-primary">{contact.name}</h2>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-container-high">
              <a
                href={`https://wa.me/${contact.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-on-primary text-body-md font-semibold hover:opacity-90 transition-opacity"
              >
                <WhatsAppIcon />
                {dict.contatti.cta}
              </a>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
