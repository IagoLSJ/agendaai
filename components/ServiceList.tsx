'use client'

import { Service } from '@/types'
import { deleteService } from '@/services/services-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ServiceList({ services }: { services: Service[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return
    }

    setLoading(id)
    try {
      await deleteService(id)
      router.refresh()
    } catch (error) {
      alert('Falha ao excluir serviço. Ele pode ter agendamentos existentes.')
    } finally {
      setLoading(null)
    }
  }

  if (services.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Nenhum serviço ainda. Adicione o seu primeiro serviço!</p>
      </div>
    )
  }

  return (
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
            </div>
          </div>
          <button
            onClick={() => handleDelete(service.id)}
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
      ))}
    </div>
  )
}
