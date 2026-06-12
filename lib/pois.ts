import dueRocche from "@/immagini/cosa-visitare/due-rocche.png"
import cidma from "@/immagini/cosa-visitare/cidma.png"
import chiesaMadre from "@/immagini/cosa-visitare/chiesa-madre.png"
import type { StaticImageData } from "next/image"

export type PointOfInterest = {
  id: string
  category: string
  title: string
  description: string
  image: StaticImageData
  link: string
}

export const POINTS_OF_INTEREST: PointOfInterest[] = [
  {
    id: "due-rocche",
    category: "Natura",
    title: "Cascata delle Due Rocche",
    description:
      "Un gioiello naturale incastonato nel centro di Corleone. Il fiume San Leonardo si tuffa formando un pittoresco canyon, creando un'oasi di pace e frescura, ideale per chi cerca una pausa rilassante immersa nel verde, a breve distanza dalla struttura.",
    image: dueRocche,
    link: "https://maps.app.goo.gl/SfRCH8L4GL2SwBn66",
  },
  {
    id: "cidma",
    category: "Cultura",
    title: "CIDMA",
    description:
      "Il Centro Internazionale di Documentazione sulle Mafie e del Movimento Antimafia offre un percorso fondamentale per comprendere la storia recente della Sicilia. Un'esperienza toccante e necessaria, che custodisce i faldoni del Maxiprocesso e le testimonianze del coraggio civile.",
    image: cidma,
    link: "https://www.cidmacorleone.it/",
  },
  {
    id: "chiesa-madre",
    category: "Architettura",
    title: "Chiesa Madre",
    description:
      "Dedicata a San Martino, la Chiesa Madre è il cuore spirituale e architettonico della città. Con i suoi interni maestosi e le opere d'arte custodite, rappresenta un eccellente esempio di architettura religiosa siciliana, testimone silenziosa dei secoli di storia corleonese.",
    image: chiesaMadre,
    link: "https://comune.corleone.pa.it/vivere-il-comune/luoghi/chiesa-di-san-martino-chiesa-madre/",
  },
]
