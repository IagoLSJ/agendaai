'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Toast, { ToastType } from '../ui/Toast'

interface ToastContextType {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([])

    const addToast = (message: string, type: ToastType) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, message, type }])
    }

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    const success = (message: string) => addToast(message, 'success')
    const error = (message: string) => addToast(message, 'error')
    const info = (message: string) => addToast(message, 'info')

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
