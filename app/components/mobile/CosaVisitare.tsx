import Image from "next/image";
import Link from "next/link";
import dueRocche from "@/immagini/cosa-visitare/due-rocche.png"
import cidma from "@/immagini/cosa-visitare/cidma.png"
import chiesaMadre from "@/immagini/cosa-visitare/chiesa-madre.png"

const pois = [
  {
    category: "Natura",
    title: "Cascata delle Due Rocche",
    description:
      "Un gioiello naturale incastonato nel centro di Corleone. Il fiume San Leonardo si tuffa formando un pittoresco canyon, creando un'oasi di pace e frescura, ideale per chi cerca una pausa rilassante immersa nel verde, a breve distanza dalla struttura.",
    image: dueRocche,
    link: "https://maps.app.goo.gl/SfRCH8L4GL2SwBn66",
  },
  {
    category: "Cultura",
    title: "CIDMA",
    description:
      "Il Centro Internazionale di Documentazione sulle Mafie e del Movimento Antimafia offre un percorso fondamentale per comprendere la storia recente della Sicilia. Un'esperienza toccante e necessaria, che custodisce i faldoni del Maxiprocesso e le testimonianze del coraggio civile.",
    image: cidma,
    link: "https://www.cidmacorleone.it/",
  },
  {
    category: "Architettura",
    title: "Chiesa Madre",
    description:
      "Dedicata a San Martino, la Chiesa Madre è il cuore spirituale e architettonico della città. Con i suoi interni maestosi e le opere d'arte custodite, rappresenta un eccellente esempio di architettura religiosa siciliana, testimone silenziosa dei secoli di storia corleonese.",
    image: chiesaMadre,
    link: "https://comune.corleone.pa.it/vivere-il-comune/luoghi/chiesa-di-san-martino-chiesa-madre/",
  },
]

export default function MobileCosaVisitare() {
  return (
    <>
      <header className="px-margin-mobile py-16 max-w-container-max mx-auto text-center border-b border-surface-variant w-full">
        <h1 className="text-headline-lg-mobile text-primary font-bold mb-6">
          Cosa Visitare
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Scopri i tesori nascosti di Corleone. Un viaggio attraverso natura incontaminata, storia profonda e architettura sacra, a pochi passi dalla nostra guesthouse.
        </p>
      </header>

      <main className="max-w-container-max mx-auto w-full">
        {pois.map((poi) => (
          <section key={poi.title} className="flex flex-col border-b border-surface-variant">
            <div className="w-full aspect-[4/3] bg-surface-container-high overflow-hidden relative">
              <Image
                src={poi.image}
                alt={poi.title}
                fill
                className="object-cover grayscale-hover"
              />
            </div>
            <div className="px-margin-mobile py-12 flex flex-col justify-center">
              <span className="inline-block bg-surface-container-high text-primary px-3 py-1 text-label-sm font-semibold uppercase tracking-widest mb-4 w-fit">
                {poi.category}
              </span>
              <h2 className="text-headline-md font-semibold text-primary mb-4">{poi.title}</h2>
              <p className="text-body-md text-on-surface-variant mb-6">{poi.description}</p>
              <Link
                href={poi.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary text-label-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity w-fit group"
              >
                Scopri di più
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </section>
        ))}

        <section className="px-margin-mobile py-20 text-center bg-surface-container-low">
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
  )
}
