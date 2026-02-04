'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@/types'

// Icons (Heroicons v1/v2 style)
const Icons = {
    Home: (props: any) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Services: (props: any) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M刀8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Clock: (props: any) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Cash: (props: any) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Logout: (props: any) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    )
}

const navigation = [
    { name: 'Agendamentos', href: '/dashboard/appointments', icon: Icons.Home },
    { name: 'Serviços', href: '/dashboard/services', icon: Icons.Services },
    { name: 'Horários', href: '/dashboard/hours', icon: Icons.Clock },
    { name: 'Financeiro', href: '/dashboard/finance', icon: Icons.Cash },
]

export default function DashboardSidebar({ user }: { user: User }) {
    const pathname = usePathname()

    return (
        <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 z-50">
            {/* Header / Logo */}
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                        <span className="font-bold text-xl">A</span>
                    </div>
                    <span className="font-bold text-xl text-gray-900 tracking-tight">AgendaAI</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group
                                ${isActive
                                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user.business_name}
                        </p>
                    </div>
                    <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Sair"
                    // Add logout logic here later
                    >
                        <Icons.Logout className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
