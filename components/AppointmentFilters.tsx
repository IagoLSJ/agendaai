'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent } from 'react'

export default function AppointmentFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentFilter = searchParams.get('filter') || 'upcoming'
    const customDate = searchParams.get('date') || ''

    const handleFilterChange = (filter: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('filter', filter)
        if (filter !== 'specific') {
            params.delete('date')
        }
        router.push(`?${params.toString()}`)
    }

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value
        const params = new URLSearchParams(searchParams)
        params.set('filter', 'specific')
        params.set('date', date)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-xl border border-secondary-200 shadow-sm mb-6">
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handleFilterChange('upcoming')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentFilter === 'upcoming'
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                            : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                        }`}
                >
                    Próximos
                </button>
                <button
                    onClick={() => handleFilterChange('today')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentFilter === 'today'
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                            : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                        }`}
                >
                    Hoje
                </button>
                <button
                    onClick={() => handleFilterChange('week')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentFilter === 'week'
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                            : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                        }`}
                >
                    Esta Semana
                </button>
                <button
                    onClick={() => handleFilterChange('month')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentFilter === 'month'
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                            : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                        }`}
                >
                    Este Mês
                </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                <label className="text-sm font-medium text-secondary-600 whitespace-nowrap">
                    Data específica:
                </label>
                <input
                    type="date"
                    value={customDate}
                    onChange={handleDateChange}
                    className={`input py-1.5 px-3 text-sm ${currentFilter === 'specific' ? 'border-primary-500 ring-1 ring-primary-500' : ''
                        }`}
                    onClick={() => {
                        if (currentFilter !== 'specific' && customDate) {
                            handleFilterChange('specific')
                        }
                    }}
                />
            </div>
        </div>
    )
}
