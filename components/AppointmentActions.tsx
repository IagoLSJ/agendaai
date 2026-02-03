'use client'

import { updateAppointmentStatus } from '@/services/appointments-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useToast } from '@/components/providers/ToastProvider'
import Modal from '@/components/ui/Modal'

export default function AppointmentActions({
  appointmentId,
}: {
  appointmentId: string
}) {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [actionStatus, setActionStatus] = useState<'completed' | 'cancelled' | null>(null)

  const handleStatusChange = async (status: 'completed' | 'cancelled') => {
    setActionStatus(status)
    setModalOpen(true)
  }

  const confirmAction = async () => {
    if (!actionStatus) return

    setLoading(true)
    try {
      await updateAppointmentStatus(appointmentId, actionStatus)
      success(`Agendamento ${actionStatus === 'completed' ? 'concluído' : 'cancelado'} com sucesso!`)
      router.refresh()
    } catch (err) {
      error('Falha ao atualizar agendamento')
    } finally {
      setLoading(false)
      setModalOpen(false)
      setActionStatus(null)
    }
  }

  return (
    <>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={actionStatus === 'completed' ? 'Concluir Agendamento' : 'Cancelar Agendamento'}
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${actionStatus === 'completed' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              onClick={confirmAction}
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Confirmar'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Tem certeza que deseja marcar este agendamento como <strong>{actionStatus === 'completed' ? 'concluído' : 'cancelado'}</strong>?
        </p>
      </Modal>
    </>
  )
}
