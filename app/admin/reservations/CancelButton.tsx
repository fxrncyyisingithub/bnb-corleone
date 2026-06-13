"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CancelButton({ reservationId }: { reservationId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm("Rimborsare e cancellare questa prenotazione?")) return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/cancel-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId }),
      })
      const data = await res.json()
      if (data.success) {
        router.refresh()
      } else {
        alert(data.error || "Errore durante la cancellazione")
        setLoading(false)
      }
    } catch {
      alert("Errore di connessione")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="text-[10px] font-bold uppercase tracking-widest bg-[#fce8e6] text-[#c5221f] px-2 py-1 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
    >
      {loading ? "..." : "Rimborsa"}
    </button>
  )
}
