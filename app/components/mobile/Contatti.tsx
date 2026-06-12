import { CONTACTS } from "@/lib/contacts"
import WhatsAppIcon from "@/app/components/WhatsAppIcon"
import { User } from "lucide-react"

type Dict = {
  title: string
  description: string
  cta: string
}

export default function MobileContatti({ dict }: { dict: Dict }) {
  return (
    <div className="flex-grow w-full px-margin-mobile py-10 flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-headline-lg-mobile font-bold text-primary">{dict.title}</h1>
        <p className="text-body-md text-secondary">
          {dict.description}
        </p>
      </section>

      <div className="flex flex-col gap-5">
        {CONTACTS.map((contact) => (
          <section
            key={contact.phone}
            className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-high shrink-0 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" aria-hidden />
              </div>
              <h2 className="text-[20px] font-semibold text-primary">{contact.name}</h2>
            </div>
            <a
              href={`https://wa.me/${contact.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-on-primary text-body-md font-semibold active:scale-95 transition-transform"
            >
              <WhatsAppIcon />
              {dict.cta}
            </a>
          </section>
        ))}
      </div>
    </div>
  )
}
