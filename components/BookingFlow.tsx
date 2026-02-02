'use client'

import { Service, BookingFormData } from '@/types'
import { useState } from 'react'
import ServiceSelection from './booking/ServiceSelection'
import DateSelection from './booking/DateSelection'
import TimeSelection from './booking/TimeSelection'
import ClientInfoForm from './booking/ClientInfoForm'
import ConfirmationScreen from './booking/ConfirmationScreen'

type Step = 'service' | 'date' | 'time' | 'info' | 'confirmed'

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
            {['service', 'date', 'time', 'info'].map((s, index) => (
              <div
                key={s}
                className={`flex-1 ${index > 0 ? 'ml-2' : ''}`}
              >
                <div
                  className={`h-2 rounded-full ${['service', 'date', 'time', 'info'].indexOf(step) >= index
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                    }`}
                />
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center">
            Passo {['service', 'date', 'time', 'info'].indexOf(step) + 1} de 4
          </div>
        </div>
      )}

      {/* Steps */}
      {step === 'service' && (
        <ServiceSelection services={services} onSelect={handleServiceSelect} />
      )}

      {step === 'date' && selectedService && (
        <DateSelection
          service={selectedService}
          userId={userId}
          onSelect={handleDateSelect}
          onBack={() => setStep('service')}
        />
      )}

      {step === 'time' && selectedService && bookingData.date && (
        <TimeSelection
          service={selectedService}
          userId={userId}
          date={bookingData.date}
          onSelect={handleTimeSelect}
          onBack={() => setStep('date')}
        />
      )}

      {step === 'info' && selectedService && bookingData.date && bookingData.startTime && (
        <ClientInfoForm
          service={selectedService}
          userId={userId}
          date={bookingData.date}
          startTime={bookingData.startTime}
          onSubmit={handleClientInfo}
          onConfirmed={handleConfirmed}
          onBack={() => setStep('time')}
        />
      )}

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
