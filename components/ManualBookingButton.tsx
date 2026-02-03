'use client'

import { useState } from 'react'
import { Service } from '@/types'
import ManualBookingModal from './ManualBookingModal'

export default function ManualBookingButton({
    services,
    userId
}: {
    services: Service[]
    userId: string
}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-primary w-full sm:w-auto shadow-xl shadow-primary-500/20 text-sm sm:text-base"
            >
                <span className="sm:hidden">Novo Agendamento</span>
                <span className="hidden sm:inline">+ Novo Agendamento</span>
            </button>

            <ManualBookingModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                services={services}
                userId={userId}
            />
        </>
    )
}
