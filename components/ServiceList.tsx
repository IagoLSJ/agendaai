'use client'

import { Service } from '@/types'
import { deleteService } from '@/services/services-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useToast } from '@/components/providers/ToastProvider'
import Modal from '@/components/ui/Modal'
import EditServiceModal from '@/components/EditServiceModal'

export default function ServiceList({ services }: { services: Service[] }) {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    setLoading(deleteId)
    try {
      await deleteService(deleteId)
      success('Serviço excluído com sucesso!')
      router.refresh()
    } catch (err: any) {
      if (err.message === 'PENDING_APPOINTMENTS') {
        error('Não é possível excluir: existem agendamentos futuros confirmados.')
      } else {
        error('Falha ao excluir serviço. Tente novamente.')
      }
    } finally {
      setLoading(null)
      setDeleteId(null)
    }
  }

  if (services.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Nenhum serviço ativo. Adicione o seu primeiro serviço!</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-xl border border-secondary-200 shadow-sm hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="mb-4 sm:mb-0">
              <h4 className="font-bold text-secondary-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">{service.name}</h4>
              <div className="flex items-center text-sm text-secondary-500 font-medium">
                <svg className="w-4 h-4 mr-1.5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {service.duration} minutos
                <span className="mx-2">•</span>
                <span className="text-secondary-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price || 0)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingService(service)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-secondary-700 bg-white rounded-lg border border-secondary-300 hover:bg-secondary-50 transition-colors"
                disabled={loading === service.id}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => setDeleteId(service.id)}
                disabled={loading === service.id}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === service.id ? (
                  <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <EditServiceModal
        service={editingService}
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        onSuccess={() => {
          setEditingService(null)
          router.refresh()
        }}
      />

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Excluir Serviço"
        footer={
          <>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleDelete}
            >
              Excluir
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setDeleteId(null)}
            >
              Cancelar
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Tem certeza que deseja excluir este serviço? Se houver histórico financeiro, ele será apenas arquivado.
        </p>
      </Modal>
    </>
  )
}
