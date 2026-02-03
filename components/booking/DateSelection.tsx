'use client'

import { Service } from '@/types'
import { getNextDays, formatDate, getDayOfWeek } from '@/lib/utils/scheduling'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DateSelection({
  service,
  userId,
  onSelect,
  onBack,
}: {
  service: Service
  userId: string
  onSelect: (date: string) => void
  onBack: () => void
}) {
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    async function loadAvailableDates() {
      const supabase = createClient()

      const { data: businessHours } = await supabase
        .from('business_hours')
        .select('day_of_week')
        .eq('user_id', userId)
        .returns<{ day_of_week: number }[]>()

      const openDays = businessHours?.map((h) => h.day_of_week) || []

      const dates = getNextDays(7).filter((date) => {
        const dayOfWeek = getDayOfWeek(date)
        return openDays.includes(dayOfWeek)
      })

      console.log(businessHours)

      setAvailableDates(dates)
      setLoading(false)
    }

    loadAvailableDates()
  }, [userId])

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    setTimeout(() => onSelect(date), 150)
  }

  // Group dates by month
  const datesByMonth = availableDates.reduce((acc, date) => {
    const monthYear = new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    })
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(date)
    return acc
  }, {} as Record<string, string[]>)

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando datas disponíveis...</p>
        </div>
      </div>
    )
  }

  if (availableDates.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
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
          Voltar para serviços
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Selecione uma Data
        </h2>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Nenhuma data disponível
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            No momento não há datas disponíveis para agendamento
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Voltar para Serviços
          </button>
        </div>
      </div>
    )
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
        Voltar para serviços
      </button>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Selecione uma Data
        </h2>
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm sm:text-base font-medium">{service.name}</span>
        </div>
      </div>

      {/* Dates Grid by Month */}
      <div className="space-y-6 sm:space-y-8">
        {Object.entries(datesByMonth).map(([monthYear, dates]) => (
          <div key={monthYear}>
            {/* Month Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <h3 className="text-sm sm:text-base font-bold text-gray-700 uppercase tracking-wider">
                {monthYear}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dates.map((date) => {
                const dateObj = new Date(`${date}T12:00:00`)
                const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' })
                const dayNumber = dateObj.getDate()
                const monthName = dateObj.toLocaleDateString('pt-BR', { month: 'short' })
                const isSelected = selectedDate === date
                // Compare with local today string
                const today = new Date()
                const todayYear = today.getFullYear()
                const todayMonth = String(today.getMonth() + 1).padStart(2, '0')
                const todayDay = String(today.getDate()).padStart(2, '0')
                const localTodayString = `${todayYear}-${todayMonth}-${todayDay}`
                const isToday = date === localTodayString

                return (
                  <button
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className={`
                      group relative p-4 rounded-xl border-2 transition-all duration-200
                      ${isSelected
                        ? 'border-primary-600 bg-primary-50 shadow-lg shadow-primary-500/20 scale-[0.98]'
                        : 'border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50 hover:shadow-md hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Calendar Icon */}
                      <div className={`
                        flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex flex-col items-center justify-center
                        ${isSelected
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900 group-hover:bg-primary-100 group-hover:text-primary-900'
                        }
                        transition-colors
                      `}>
                        <span className="text-xs font-semibold uppercase opacity-75">
                          {dayName}
                        </span>
                        <span className="text-xl sm:text-2xl font-bold leading-none">
                          {dayNumber}
                        </span>
                        <span className="text-xs opacity-75 capitalize">
                          {monthName}
                        </span>
                      </div>

                      {/* Date Info */}
                      <div className="flex-1 text-left overflow-hidden">
                        <p className={`
                          font-bold text-base mb-0.5 capitalize leading-tight
                          ${isSelected ? 'text-primary-900' : 'text-gray-900'}
                        `}>
                          {dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })}
                        </p>
                        <p className={`
                          text-sm
                          ${isSelected ? 'text-primary-700' : 'text-gray-500'}
                        `}>
                          {dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                        </p>
                        {isToday && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-full">
                            Hoje
                          </span>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <svg
                        className={`
                          w-5 h-5 sm:w-6 sm:h-6 transition-all
                          ${isSelected
                            ? 'text-primary-600 translate-x-0'
                            : 'text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1'
                          }
                        `}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Dica
            </p>
            <p className="text-xs sm:text-sm text-blue-700">
              Selecione a data desejada para visualizar os horários disponíveis
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}