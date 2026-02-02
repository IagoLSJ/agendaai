'use client'

import { updateAppointmentStatus } from '@/services/appointments-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AppointmentActions({
  appointmentId,
}: {
  appointmentId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (status: 'completed' | 'cancelled') => {
    const statusText = status === 'completed' ? 'concluído' : 'cancelado'
    if (!confirm(`Tem certeza que deseja marcar este agendamento como ${statusText}?`)) {
      return
    }

    setLoading(true)
    try {
      await updateAppointmentStatus(appointmentId, status)
      router.refresh()
    } catch (error) {
      alert('Falha ao atualizar agendamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatusChange('completed')}
        disabled={loading}
        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        Concluir
      </button>
      <button
        onClick={() => handleStatusChange('cancelled')}
        disabled={loading}
        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>
  )
}
