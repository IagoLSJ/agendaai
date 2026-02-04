'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Icons (Simplified for mobile)
const Icons = {
    Home: (props: any) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Services: (props: any) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
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
}

const navigation = [
    { name: 'Agenda', href: '/dashboard/appointments', icon: Icons.Home },
    { name: 'Serviços', href: '/dashboard/services', icon: Icons.Services },
    { name: 'Horários', href: '/dashboard/hours', icon: Icons.Clock },
    { name: 'Caixa', href: '/dashboard/finance', icon: Icons.Cash },
]

export default function MobileBottomNav() {
    const pathname = usePathname()

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-xl shadow-black/10 rounded-2xl p-2 flex justify-around items-center">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 -translate-y-2'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <item.icon
                                className={`w-6 h-6 mb-0.5 ${isActive ? 'text-white' : 'text-current'}`}
                            />
                            <span className="text-[10px] font-medium leading-none">
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
