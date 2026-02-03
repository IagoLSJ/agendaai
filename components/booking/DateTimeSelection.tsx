'use client'

import { Service, TimeSlot } from '@/types'
import { getNextDays, formatDate, formatTime, getDayOfWeek } from '@/lib/utils/scheduling'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getAvailableTimeSlots } from '@/services/appointments-client'

export default function DateTimeSelection({
    service,
    userId,
    onSelect,
    onBack,
}: {
    service: Service
    userId: string
    onSelect: (date: string, time: string) => void
    onBack: () => void
}) {
    const [availableDates, setAvailableDates] = useState<string[]>([])
    const [loadingDates, setLoadingDates] = useState(true)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    // Load Dates
    useEffect(() => {
        async function loadAvailableDates() {
            const supabase = createClient()

            const { data: businessHours } = await supabase
                .from('business_hours')
                .select('day_of_week')
                .eq('user_id', userId)
                .returns<{ day_of_week: number }[]>()

            const openDays = businessHours?.map((h) => h.day_of_week) || []

            const dates = getNextDays(14).filter((date) => { // Increased to 14 days
                const dayOfWeek = getDayOfWeek(date)
                return openDays.includes(dayOfWeek)
            })

            setAvailableDates(dates)
            setLoadingDates(false)

            // Auto-select first date if available? No, let user choose.
        }

        loadAvailableDates()
    }, [userId])

    // Load Slots when Date changes
    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([])
            return
        }

        async function loadSlots() {
            if (!selectedDate) return
            setLoadingSlots(true)
            try {
                const availableSlots = await getAvailableTimeSlots(userId, service.id, selectedDate)
                setTimeSlots(availableSlots)
            } catch (error) {
                console.error('Error loading slots:', error)
            } finally {
                setLoadingSlots(false)
            }
        }

        if (selectedDate) {
            loadSlots()
        }
    }, [selectedDate, userId, service.id])

    const handleDateClick = (date: string) => {
        if (selectedDate === date) {
            setSelectedDate(null) // Deselect
            return
        }
        setSelectedDate(date)
    }

    const handleTimeClick = (time: string) => {
        if (selectedDate) {
            onSelect(selectedDate, time)
        }
    }

    if (loadingDates) {
        return (
            <div className="p-8 text-center">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Carregando disponibilidade...</p>
            </div>
        )
    }

    if (availableDates.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">Nenhuma data disponível nos próximos dias.</p>
                <button onClick={onBack} className="text-primary-600 font-medium">Voltar</button>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn mx-auto max-w-5xl">
            <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium text-sm mb-6 transition-colors group"
            >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
            </button>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Data e Horário</h2>
                <p className="text-gray-500">Escolha o melhor dia para você</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Dates */}
                <div className="flex-1 w-full overflow-hidden">
                    <div className="flex md:grid md:grid-cols-3 lg:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-1 md:px-0 -mx-1 md:mx-0 snap-x">
                        {availableDates.map((date) => {
                            const dateObj = new Date(`${date}T12:00:00`)
                            const isSelected = selectedDate === date
                            const isToday = date === new Date().toISOString().split('T')[0]
                            const monthName = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')

                            return (
                                <button
                                    key={date}
                                    onClick={() => handleDateClick(date)}
                                    className={`
                                        flex-shrink-0 w-[85px] md:w-auto snap-start
                                        relative p-3 rounded-xl border-2 text-center md:text-left transition-all duration-200
                                        flex flex-col items-center md:items-start justify-center md:justify-start
                                        ${isSelected
                                            ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-100 ring-offset-1'
                                            : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-md'
                                        }
                                    `}
                                >
                                    <span className={`text-xs font-semibold uppercase mb-1 ${isSelected ? 'text-primary-700' : 'text-gray-400'}`}>
                                        {dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                                    </span>
                                    <span className={`text-2xl font-bold leading-none mb-1 ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                                        {dateObj.getDate()}
                                    </span>
                                    <span className={`text-xs font-medium uppercase ${isSelected ? 'text-primary-600' : 'text-gray-400'}`}>
                                        {monthName}
                                    </span>

                                    {isToday && (
                                        <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 bg-green-500 rounded-full"></span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Right Column: Time Slots */}
                <div className="lg:w-80 flex-shrink-0">
                    <div className={`
                sticky top-6 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6
                transition-all duration-300
                ${selectedDate ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4 pointer-events-none grayscale'}
            `}>
                        {!selectedDate ? (
                            <div className="text-center py-12 text-gray-400">
                                <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <p>Selecione uma data para ver os horários</p>
                            </div>
                        ) : loadingSlots ? (
                            <div className="text-center py-12">
                                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-sm text-gray-500">Buscando horários...</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold text-gray-900 mb-1">
                                    Horários disponíveis
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 capitalize">
                                    {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>

                                {timeSlots.filter(s => s.available).length === 0 ? (
                                    <div className="text-center py-8 bg-red-50 rounded-lg border border-red-100">
                                        <p className="text-sm text-red-600 font-medium">Sem horários livres</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                                        {timeSlots.filter(s => s.available).map((slot) => (
                                            <button
                                                key={slot.time}
                                                onClick={() => handleTimeClick(slot.time)}
                                                className="py-2 px-1 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all focus:ring-2 focus:ring-primary-200"
                                            >
                                                {formatTime(slot.time)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
