import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosa Visitare",
};

export default function CosaVisitare() {
  return (
    <>
      {/* Header Section */}
      <header className="px-margin-mobile md:px-margin-desktop py-16 md:py-24 max-w-container-max mx-auto text-center border-b border-surface-variant w-full">
        <h1 className="text-headline-lg-mobile md:text-display text-primary font-bold mb-6">
          Cosa Visitare
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Scopri i tesori nascosti di Corleone. Un viaggio attraverso natura incontaminata, storia profonda e architettura sacra, a pochi passi dalla nostra guesthouse.
        </p>
      </header>

      {/* Points of Interest List */}
      <main className="max-w-container-max mx-auto w-full">
        {/* POI 1 */}
        <section className="flex flex-col md:flex-row border-b border-surface-variant">
          <div className="w-full md:w-1/2 aspect-[4/3] bg-surface-container-high overflow-hidden relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcKRehtgES_0Mi7hyrjE4CgmbvqcXPBT5JLSqv5WOFeNYLbki_s_mIz8HnhkaFQHHYMVnVuKtpY3XlGaKQ0JbgdZPzaEEOw7W9eMhBUKWjp-qtI3pSAdgb29AnYfpZweh3i3B0rSImwv7v1lQm7o3CDro0OY9NLuMGRaZzHvYz64p_Dgrv-9ZMEmHw5rbfJgYJbY_KR9VMk74AAWmDn2GoGuBL6zSZYTA5Jp_1r7ZjF3-mh1nD2VQWn4Z3Rb-PmC-sOqw5gR00uU0"
              alt="Cascata delle Due Rocche"
              fill
              className="object-cover grayscale-hover"
            />
          </div>
          <div className="w-full md:w-1/2 px-margin-mobile md:px-margin-desktop py-12 flex flex-col justify-center">
            <span className="inline-block bg-surface-container-high text-primary px-3 py-1 text-label-sm font-semibold uppercase tracking-widest mb-4 w-fit">
              Natura
            </span>
            <h2 className="text-headline-md font-semibold text-primary mb-4">
              Cascata delle Due Rocche
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Un gioiello naturale incastonato nel centro di Corleone. Il fiume San Leonardo si tuffa formando un pittoresco canyon, creando un'oasi di pace e frescura, ideale per chi cerca una pausa rilassante immersa nel verde, a breve distanza dalla struttura.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-primary text-label-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity w-fit group"
            >
              Scopri di più
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>

        {/* POI 2 */}
        <section className="flex flex-col md:flex-row-reverse border-b border-surface-variant">
          <div className="w-full md:w-1/2 aspect-[4/3] bg-surface-container-high overflow-hidden relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuARG_uHuHpyV5TH-k3-W5RpCHXai5EZLdwH4oAk5RpQrHmvDdTfl1RstOvlq1wKj1JBagbY-nrO4pXG55uZGgYcRPTnaPoJ40XHDyXKMFY4QFlTycskXHpSXJ9EF-oLOMZNpMcJejLrwga9uxgOcrmcTVnUdhBzkh43Wo6eXYM5p0xg72cR_Si63kCWio1X7LnplXZFDhgKoYGeNah7KUC0IstlVOpTwOLdaR-Doldc4K8vg195zED1oej0EHjDSa6jfftYHK8c_Lo"
              alt="CIDMA Museum"
              fill
              className="object-cover grayscale-hover"
            />
          </div>
          <div className="w-full md:w-1/2 px-margin-mobile md:px-margin-desktop py-12 flex flex-col justify-center">
            <span className="inline-block bg-surface-container-high text-primary px-3 py-1 text-label-sm font-semibold uppercase tracking-widest mb-4 w-fit">
              Cultura
            </span>
            <h2 className="text-headline-md font-semibold text-primary mb-4">
              CIDMA
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Il Centro Internazionale di Documentazione sulle Mafie e del Movimento Antimafia offre un percorso fondamentale per comprendere la storia recente della Sicilia. Un'esperienza toccante e necessaria, che custodisce i faldoni del Maxiprocesso e le testimonianze del coraggio civile.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-primary text-label-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity w-fit group"
            >
              Scopri di più
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>

        {/* POI 3 */}
        <section className="flex flex-col md:flex-row border-b border-surface-variant">
          <div className="w-full md:w-1/2 aspect-[4/3] bg-surface-container-high overflow-hidden relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNNE6f2H8URlVZge6EGX2Ti5jy2VjZ4iwcz6E9VPTINV0um4u64Grw2G6QEf6ynEmi1M_2P4-FgJEsn3bryAs5DfN008sp9zIYL685pRrGw-5nDDAP4Bx87Gv_6qawtxjx7v9uvWnMEgWfL2gSxhKUGXgTnMqeRmiTTP6GA_FeT9APdQHXvw5Sh0T80Oy5pSj8bPb2hDERxLFgz6w0VijvhoMUGqk4QSqtrTo1esYg8NsEzf6bzjs7JKNjL5p0fmOB6iCUxYTQpc8"
              alt="Chiesa Madre"
              fill
              className="object-cover grayscale-hover"
            />
          </div>
          <div className="w-full md:w-1/2 px-margin-mobile md:px-margin-desktop py-12 flex flex-col justify-center">
            <span className="inline-block bg-surface-container-high text-primary px-3 py-1 text-label-sm font-semibold uppercase tracking-widest mb-4 w-fit">
              Architettura
            </span>
            <h2 className="text-headline-md font-semibold text-primary mb-4">
              Chiesa Madre
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Dedicata a San Martino, la Chiesa Madre è il cuore spirituale e architettonico della città. Con i suoi interni maestosi e le opere d'arte custodite, rappresenta un eccellente esempio di architettura religiosa siciliana, testimone silenziosa dei secoli di storia corleonese.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-primary text-label-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity w-fit group"
            >
              Scopri di più
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>

        {/* Action Call */}
        <section className="px-margin-mobile md:px-margin-desktop py-20 text-center bg-surface-container-low">
          <h3 className="text-headline-md font-semibold text-primary mb-6">
            Pronto per esplorare?
          </h3>
          <p className="text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
            Prenota il tuo soggiorno a CORLEONE GUESTHOUSE e usa la nostra guesthouse come base perfetta per le tue avventure.
          </p>
          <Link
            href="/camere"
            className="inline-block bg-primary text-on-primary px-8 py-4 text-label-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Verifica Disponibilità
          </Link>
        </section>
      </main>
    </>
  );
}
