import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prenotazioni - Area Riservata',
}

export default async function AdminReservations() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select(`
      *,
      rooms (
        name
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full pt-10 md:pt-20 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-headline-md font-bold text-primary">Gestione Prenotazioni</h1>
      </div>
      
      {error && <p className="text-error">Errore nel caricamento delle prenotazioni.</p>}
      
      <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant text-label-sm uppercase tracking-widest text-secondary bg-surface-container-low">
              <th className="p-4">Data</th>
              <th className="p-4">Ospite</th>
              <th className="p-4">Camera</th>
              <th className="p-4">Check-in / Check-out</th>
              <th className="p-4">Importo</th>
              <th className="p-4">Stato</th>
            </tr>
          </thead>
          <tbody>
            {reservations?.map((res) => (
              <tr key={res.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="p-4 text-body-md text-primary">
                  {format(new Date(res.created_at), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="p-4">
                  <div className="text-body-md font-semibold text-primary">{res.guest_name}</div>
                  <div className="text-body-sm text-secondary">{res.guest_email}</div>
                  <div className="text-body-sm text-secondary">{res.guest_phone}</div>
                </td>
                <td className="p-4 text-body-md text-primary">{res.rooms?.name}</td>
                <td className="p-4 text-body-md text-primary">
                  {format(new Date(res.check_in), 'dd/MM/yyyy')} - {format(new Date(res.check_out), 'dd/MM/yyyy')}
                </td>
                <td className="p-4 text-body-md text-primary font-semibold">€{res.total_price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${
                    res.status === 'paid' ? 'bg-[#e6f4ea] text-[#137333]' : 
                    res.status === 'pending' ? 'bg-[#fef7e0] text-[#b06000]' : 
                    'bg-[#fce8e6] text-[#c5221f]'
                  }`}>
                    {res.status}
                  </span>
                </td>
              </tr>
            ))}
            {reservations?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-body-md text-secondary">Nessuna prenotazione trovata.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
