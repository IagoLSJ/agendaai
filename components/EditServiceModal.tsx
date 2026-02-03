'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types'
import { updateService } from '@/services/services-client'
import { useToast } from '@/components/providers/ToastProvider'
import Modal from '@/components/ui/Modal'

interface EditServiceModalProps {
    service: Service | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function EditServiceModal({ service, isOpen, onClose, onSuccess }: EditServiceModalProps) {
    const { success, error } = useToast()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [duration, setDuration] = useState('30')
    const [price, setPrice] = useState('0')

    useEffect(() => {
        if (service) {
            setName(service.name)
            setDuration(service.duration.toString())
            setPrice(service.price ? service.price.toString().replace('.', ',') : '0')
        }
    }, [service])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!service) return

        setLoading(true)

        try {
            await updateService(service.id, {
                name,
                duration: parseInt(duration),
                price: isNaN(parseFloat(price.replace(',', '.'))) ? 0 : parseFloat(price.replace(',', '.')),
            })

            success('Serviço atualizado com sucesso!')
            onSuccess()
            onClose()
        } catch (err) {
            console.error('Error updating service:', err)
            error('Falha ao atualizar serviço.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Serviço"
        >
            <form onSubmit={handleSubmit} id="edit-service-form" className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
                    <input
                        type="text"
                        className="input mt-1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input mt-1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Duração</label>
                    <div className="relative mt-1">
                        <select
                            className="input appearance-none"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        >
                            <option value="15">15 minutos</option>
                            <option value="30">30 minutos</option>
                            <option value="45">45 minutos</option>
                            <option value="60">1 hora</option>
                            <option value="90">1.5 horas</option>
                            <option value="120">2 horas</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
