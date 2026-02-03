'use client'

import { Service, BookingFormData } from '@/types'
import { useState } from 'react'
import ServiceSelection from './booking/ServiceSelection'
import DateSelection from './booking/DateSelection'
import DateTimeSelection from './booking/DateTimeSelection'
import ClientInfoForm from './booking/ClientInfoForm'
import ConfirmationScreen from './booking/ConfirmationScreen'

type Step = 'service' | 'datetime' | 'info' | 'confirmed'

export default function BookingFlow({
  services,
  userId,
  businessName,
}: {
  services: Service[]
  userId: string
  businessName: string
}) {
  const [step, setStep] = useState<Step>('service')
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({})
  const [appointmentId, setAppointmentId] = useState<string>('')

  const selectedService = services.find((s) => s.id === bookingData.serviceId)

  const handleServiceSelect = (serviceId: string) => {
    setBookingData({ ...bookingData, serviceId })
    setStep('datetime')
  }

  const handleDateTimeSelect = (date: string, startTime: string) => {
    setBookingData({ ...bookingData, date, startTime })
    setStep('info')
  }

  const handleClientInfo = (clientName: string, clientWhatsapp: string) => {
    setBookingData({ ...bookingData, clientName, clientWhatsapp })
  }

  const handleConfirmed = (id: string) => {
    setAppointmentId(id)
    setStep('confirmed')
  }

  const handleReset = () => {
    setStep('service')
    setBookingData({})
    setAppointmentId('')
  }

  return (
    <div className="card">
      {/* Progress indicator */}
      {step !== 'confirmed' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {['service', 'datetime', 'info'].map((s, index) => (
              <div
                key={s}
                className={`flex-1 ${index > 0 ? 'ml-2' : ''}`}
              >
                <div
                  className={`h-2 rounded-full ${['service', 'datetime', 'info'].indexOf(step) >= index
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
                    }`}
                />
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center">
            Passo {['service', 'datetime', 'info'].indexOf(step) + 1} de 3
          </div>
        </div>
      )}

      {/* Step 1: Service Selection */}
      {step === 'service' && (
        <ServiceSelection services={services} onSelect={handleServiceSelect} />
      )}

      {/* Step 2: Date & Time Selection (Combined) */}
      {step === 'datetime' && selectedService && (
        <DateTimeSelection
          service={selectedService}
          userId={userId}
          onSelect={handleDateTimeSelect}
          onBack={() => setStep('service')}
        />
      )}

      {/* Step 3: Client Info */}
      {step === 'info' && selectedService && bookingData.date && bookingData.startTime && (
        <ClientInfoForm
          service={selectedService}
          userId={userId}
          date={bookingData.date}
          startTime={bookingData.startTime}
          onSubmit={handleClientInfo}
          onConfirmed={handleConfirmed}
          onBack={() => setStep('datetime')}
        />
      )}

      {/* Step 4: Confirmation */}
      {step === 'confirmed' && (
        <ConfirmationScreen
          businessName={businessName}
          appointmentId={appointmentId}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
