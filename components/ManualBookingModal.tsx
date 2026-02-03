'use client'

import { useState } from 'react'
import { Service, BookingFormData } from '@/types'
import Modal from '@/components/ui/Modal'
import ServiceSelection from './booking/ServiceSelection'
import DateSelection from './booking/DateSelection'
import TimeSelection from './booking/TimeSelection'
import { createAppointment } from '@/services/appointments-client'
import { useToast } from '@/components/providers/ToastProvider'
import { useRouter } from 'next/navigation'

type Step = 'service' | 'date' | 'time' | 'info'

interface ManualBookingModalProps {
    isOpen: boolean
    onClose: () => void
    services: Service[]
    userId: string
}

export default function ManualBookingModal({
    isOpen,
    onClose,
    services,
    userId,
}: ManualBookingModalProps) {
    const router = useRouter()
    const { success, error } = useToast()
    const [step, setStep] = useState<Step>('service')
    const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({})
    const [loading, setLoading] = useState(false)

    // Form state
    const [clientName, setClientName] = useState('')
    const [clientWhatsapp, setClientWhatsapp] = useState('')

    const handleServiceSelect = (serviceId: string) => {
        setBookingData({ ...bookingData, serviceId })
        setStep('date')
    }

    const handleDateSelect = (date: string) => {
        setBookingData({ ...bookingData, date })
        setStep('time')
    }

    const handleTimeSelect = (startTime: string) => {
        setBookingData({ ...bookingData, startTime })
        setStep('info')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!bookingData.serviceId || !bookingData.date || !bookingData.startTime) return

        setLoading(true)
        try {
            await createAppointment({
                service_id: bookingData.serviceId,
                user_id: userId,
                date: bookingData.date,
                start_time: bookingData.startTime,
                client_name: clientName,
                client_whatsapp: clientWhatsapp || '',
                status: 'confirmed', // Auto-confirm manual bookings
            })

            success('Agendamento criado com sucesso!')
            handleClose()
            router.refresh()
        } catch (err) {
            console.error(err)
            error('Erro ao criar agendamento. Verifique se o horário ainda está disponível.')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setStep('service')
        setBookingData({})
        setClientName('')
        setClientWhatsapp('')
        onClose()
    }

    const selectedService = services.find((s) => s.id === bookingData.serviceId)

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="4xl"
            title={
                step === 'service' ? 'Novo Agendamento: Selecione o Serviço' :
                    step === 'date' ? 'Selecione a Data' :
                        step === 'time' ? 'Selecione o Horário' :
                            'Dados do Cliente'
            }
        >
            <div className="mt-4">
                {step === 'service' && (
                    <div className="max-h-[60vh] overflow-y-auto">
                        <div className="space-y-3">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceSelect(service.id)}
                                    className="w-full text-left p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {service.duration} min • R$ {service.price}
                                        </p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'date' && selectedService && (
                    <div className="max-h-[60vh] overflow-y-auto">
                        <DateSelection
                            service={selectedService}
                            userId={userId}
                            onSelect={handleDateSelect}
                            onBack={() => setStep('service')}
                        />
                    </div>
                )}

                {step === 'time' && selectedService && bookingData.date && (
                    <div className="max-h-[60vh] overflow-y-auto">
                        <TimeSelection
                            service={selectedService}
                            userId={userId}
                            date={bookingData.date}
                            onSelect={handleTimeSelect}
                            onBack={() => setStep('date')}
                        />
                    </div>
                )}

                {step === 'info' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
                            <p><strong>Serviço:</strong> {selectedService?.name}</p>
                            <p><strong>Data:</strong> {bookingData.date ? new Date(bookingData.date + 'T12:00:00').toLocaleDateString('pt-BR') : ''}</p>
                            <p><strong>Horário:</strong> {bookingData.startTime}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
                            <input
                                type="text"
                                className="input mt-1"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                                placeholder="Ex: João Silva"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">WhatsApp (Opcional)</label>
                            <input
                                type="tel"
                                className="input mt-1"
                                value={clientWhatsapp}
                                onChange={(e) => setClientWhatsapp(e.target.value)}
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setStep('time')}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Voltar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                                {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    )
}
