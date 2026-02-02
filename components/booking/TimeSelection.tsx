'use client'

import { Service, TimeSlot } from '@/types'
import { formatDate, formatTime } from '@/lib/utils/scheduling'
import { useState, useEffect } from 'react'
import { getAvailableTimeSlots } from '@/services/appointments-client'

export default function TimeSelection({
  service,
  userId,
  date,
  onSelect,
  onBack,
}: {
  service: Service
  userId: string
  date: string
  onSelect: (startTime: string) => void
  onBack: () => void
}) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSlots() {
      try {
        const availableSlots = await getAvailableTimeSlots(userId, service.id, date)
        setSlots(availableSlots)
      } catch (error) {
        console.error('Error loading slots:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSlots()
  }, [userId, service.id, date])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Carregando horários disponíveis...</p>
      </div>
    )
  }

  const availableSlots = slots.filter((s) => s.available)

  return (
    <div>
      <div className="mb-4">
        <button onClick={onBack} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← Voltar para datas
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecione um Horário</h2>
      <p className="text-gray-600 mb-1">{service.name}</p>
      <p className="text-gray-600 mb-4">{formatDate(date)}</p>

      {availableSlots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum horário disponível para esta data</p>
          <button onClick={onBack} className="btn btn-secondary mt-4">
            Escolher Outra Data
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
          {availableSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => onSelect(slot.time)}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors font-medium text-gray-900"
            >
              {formatTime(slot.time)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
