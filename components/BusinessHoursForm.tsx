'use client'

import { BusinessHour, DAYS_OF_WEEK } from '@/types'
import { upsertBusinessHours, deleteBusinessHour } from '@/services/business-hours-client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface DayHours {
  day_of_week: number
  enabled: boolean
  start_time: string
  end_time: string
  id?: string
}

export default function BusinessHoursForm({
  userId,
  existingHours,
}: {
  userId: string
  existingHours: BusinessHour[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hours, setHours] = useState<DayHours[]>([])
  const [successMessage, setSuccessMessage] = useState(false)

  useEffect(() => {
    const initialHours = DAYS_OF_WEEK.map((day) => {
      const existing = existingHours.find((h) => h.day_of_week === day.value)
      return {
        day_of_week: day.value,
        enabled: !!existing,
        start_time: existing?.start_time.substring(0, 5) || '09:00',
        end_time: existing?.end_time.substring(0, 5) || '17:00',
        id: existing?.id,
      }
    })
    setHours(initialHours)
  }, [existingHours])

  const handleToggle = (dayOfWeek: number) => {
    setHours((prev) =>
      prev.map((h) =>
        h.day_of_week === dayOfWeek ? { ...h, enabled: !h.enabled } : h
      )
    )
  }

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'start_time' | 'end_time',
    value: string
  ) => {
    setHours((prev) =>
      prev.map((h) =>
        h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(false)

    try {
      const disabledDays = hours.filter((h) => !h.enabled && h.id)
      for (const day of disabledDays) {
        await deleteBusinessHour(day.id!)
      }

      const enabledHours = hours
        .filter((h) => h.enabled)
        .map((h) => ({
          day_of_week: h.day_of_week,
          start_time: `${h.start_time}:00`,
          end_time: `${h.end_time}:00`,
        }))

      if (enabledHours.length > 0) {
        await upsertBusinessHours(userId, enabledHours)
      }

      router.refresh()
      setSuccessMessage(true)
      setTimeout(() => setSuccessMessage(false), 3000)
    } catch (error) {
      alert('Falha ao atualizar o horário de funcionamento')
    } finally {
      setLoading(false)
    }
  }

  const enableAllDays = () => {
    setHours((prev) => prev.map((h) => ({ ...h, enabled: true })))
  }

  const disableAllDays = () => {
    setHours((prev) => prev.map((h) => ({ ...h, enabled: false })))
  }

  const setBusinessHours = () => {
    setHours((prev) =>
      prev.map((h) => ({
        ...h,
        enabled: h.day_of_week >= 1 && h.day_of_week <= 5,
        start_time: '08:00',
        end_time: '17:00',
      }))
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Ações rápidas:</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            type="button"
            onClick={enableAllDays}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg 
                     hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ativar Todos
          </button>
          
          <button
            type="button"
            onClick={disableAllDays}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg 
                     hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Desativar Todos
          </button>
          
          <button
            type="button"
            onClick={setBusinessHours}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg 
                     hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Horário Comercial
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-3">
        {hours.map((dayHour) => {
          const dayName = DAYS_OF_WEEK.find(
            (d) => d.value === dayHour.day_of_week
          )?.label

          return (
            <div
              key={dayHour.day_of_week}
              className={`
                rounded-xl border-2 transition-all duration-200
                ${dayHour.enabled 
                  ? 'bg-white border-primary-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}
            >
              {/* Mobile Layout */}
              <div className="p-4 space-y-3 sm:hidden">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={dayHour.enabled}
                      onChange={() => handleToggle(dayHour.day_of_week)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer 
                                  peer-checked:bg-primary-600 peer-focus:ring-4 
                                  peer-focus:ring-primary-200 transition-all">
                      <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full 
                                    transition-all peer-checked:translate-x-5 shadow-sm"></div>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 flex-1">{dayName}</span>
                  {!dayHour.enabled && (
                    <span className="text-sm text-gray-500 font-medium">Fechado</span>
                  )}
                </label>

                {dayHour.enabled && (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <input
                      type="time"
                      value={dayHour.start_time}
                      onChange={(e) =>
                        handleTimeChange(
                          dayHour.day_of_week,
                          'start_time',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
                               focus:bg-white focus:border-primary-500 focus:ring-2 
                               focus:ring-primary-200 transition-all outline-none text-sm
                               text-center font-medium"
                      required
                    />
                    <span className="text-gray-500 text-sm font-medium px-1">até</span>
                    <input
                      type="time"
                      value={dayHour.end_time}
                      onChange={(e) =>
                        handleTimeChange(
                          dayHour.day_of_week,
                          'end_time',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
                               focus:bg-white focus:border-primary-500 focus:ring-2 
                               focus:ring-primary-200 transition-all outline-none text-sm
                               text-center font-medium"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center gap-4 p-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dayHour.enabled}
                    onChange={() => handleToggle(dayHour.day_of_week)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer 
                                peer-checked:bg-primary-600 peer-focus:ring-4 
                                peer-focus:ring-primary-200 transition-all">
                    <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full 
                                  transition-all peer-checked:translate-x-5 shadow-sm"></div>
                  </div>
                </label>

                <div className="min-w-[140px]">
                  <span className="font-semibold text-gray-900">{dayName}</span>
                </div>

                {dayHour.enabled ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={dayHour.start_time}
                      onChange={(e) =>
                        handleTimeChange(
                          dayHour.day_of_week,
                          'start_time',
                          e.target.value
                        )
                      }
                      className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                               focus:bg-white focus:border-primary-500 focus:ring-2 
                               focus:ring-primary-200 transition-all outline-none
                               text-center font-medium"
                      required
                    />
                    <span className="text-gray-500 font-medium">até</span>
                    <input
                      type="time"
                      value={dayHour.end_time}
                      onChange={(e) =>
                        handleTimeChange(
                          dayHour.day_of_week,
                          'end_time',
                          e.target.value
                        )
                      }
                      className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                               focus:bg-white focus:border-primary-500 focus:ring-2 
                               focus:ring-primary-200 transition-all outline-none
                               text-center font-medium"
                      required
                    />
                  </div>
                ) : (
                  <span className="text-gray-500 font-medium">Fechado</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-green-700 font-medium">
            Horário de funcionamento atualizado com sucesso!
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3.5 sm:py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold 
                 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 
                 transform hover:-translate-y-0.5 transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Salvando...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Salvar Horário de Funcionamento</span>
          </div>
        )}
      </button>
    </form>
  )
}