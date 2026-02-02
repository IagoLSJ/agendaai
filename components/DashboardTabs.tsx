'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardTabs() {
    const pathname = usePathname()

    const tabs = [
        {
            name: 'Agendamentos',
            href: '/dashboard/appointments',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: 'Serviços',
            href: '/dashboard/services',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: 'Horários',
            href: '/dashboard/hours',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ]

    return (
        <div className="mb-4 sm:mb-6">
            {/* Desktop Tabs */}
            <div className="hidden sm:block border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  flex items-center gap-2
                  ${isActive
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                `}
                            >
                                {tab.icon}
                                {tab.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Mobile Tabs */}
            <div className="sm:hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors
                  ${isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                    }
                `}
                            >
                                {tab.icon}
                                {tab.name}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
