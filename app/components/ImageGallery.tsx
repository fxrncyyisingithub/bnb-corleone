"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageGallery({ images, name }: { images: string[], name: string }) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="relative w-full aspect-[4/3] bg-surface-container-high mb-6 overflow-hidden group">
      <Image
        src={images[current]}
        alt={`${name} - Foto ${current + 1}`}
        fill
        className="object-cover transition-opacity duration-500"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Foto precedente"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden />
          </button>
          <button
            onClick={next}
            aria-label="Foto successiva"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronRight className="w-5 h-5" aria-hidden />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}