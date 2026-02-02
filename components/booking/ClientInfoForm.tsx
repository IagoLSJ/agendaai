'use client'

import { Service } from '@/types'
import { formatDate, formatTime, formatWhatsApp, isValidWhatsApp } from '@/lib/utils/scheduling'
import { useState } from 'react'
import { createAppointment } from '@/services/appointments-client'
import InputMask from 'react-input-mask'

export default function ClientInfoForm({
  service,
  userId,
  date,
  startTime,
  onSubmit,
  onConfirmed,
  onBack,
}: {
  service: Service
  userId: string
  date: string
  startTime: string
  onSubmit: (clientName: string, clientWhatsapp: string) => void
  onConfirmed: (appointmentId: string) => void
  onBack: () => void
}) {
  const [clientName, setClientName] = useState('')
  const [clientWhatsapp, setClientWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidWhatsApp(clientWhatsapp)) {
      setError('Por favor, insira um número de WhatsApp válido')
      return
    }

    setLoading(true)

    try {
      const appointment = await createAppointment({
        service_id: service.id,
        date,
        start_time: startTime,
        client_name: clientName,
        client_whatsapp: formatWhatsApp(clientWhatsapp),
        user_id: userId,
      })

      onSubmit(clientName, formatWhatsApp(clientWhatsapp))
      onConfirmed((appointment as any).id)
    } catch (err: any) {
      setError(err.message || 'Falha ao criar agendamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm mb-6 transition-colors group"
      >
        <svg 
          className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para horários
      </button>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Suas Informações
      </h2>

      {/* Appointment Summary Card */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              Resumo do Agendamento
            </h3>
            <p className="text-sm text-gray-600">
              Confirme os detalhes antes de finalizar
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <span className="text-gray-600">Serviço:</span>
              <span className="font-semibold text-gray-900 ml-2">{service.name}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <span className="text-gray-600">Data:</span>
              <span className="font-semibold text-gray-900 ml-2">{formatDate(date)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-gray-600">Horário:</span>
              <span className="font-semibold text-gray-900 ml-2">{formatTime(startTime)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <span className="text-gray-600">Duração:</span>
              <span className="font-semibold text-gray-900 ml-2">{service.duration} minutos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seu Nome Completo
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                         transition-all outline-none text-sm sm:text-base"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="João da Silva"
              required
              minLength={2}
            />
          </div>
        </div>

        {/* WhatsApp Input with Mask */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número do WhatsApp
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <InputMask
              mask="(99) 99999-9999"
              value={clientWhatsapp}
              onChange={(e) => setClientWhatsapp(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                         transition-all outline-none text-sm sm:text-base"
              placeholder="(11) 98765-4321"
              required
            />
          </div>
          <div className="mt-2 flex items-start gap-2 text-xs sm:text-sm text-gray-500">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Enviaremos uma confirmação via WhatsApp neste número</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fadeIn">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 sm:py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold 
                     rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 
                     transform hover:-translate-y-0.5 transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Confirmando agendamento...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Confirmar Agendamento</span>
            </div>
          )}
        </button>

        {/* Security Note */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Seus dados estão protegidos e seguros</span>
          </div>
        </div>
      </form>
    </div>
  )
}