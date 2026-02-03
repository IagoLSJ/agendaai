'use client'

import { createService } from '@/services/services-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useToast } from '@/components/providers/ToastProvider'

export default function ServiceForm({ userId }: { userId: string }) {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [duration, setDuration] = useState('30')
  const [price, setPrice] = useState('0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createService({
        name,
        duration: parseInt(duration),
        price: isNaN(parseFloat(price.replace(',', '.'))) ? 0 : parseFloat(price.replace(',', '.')),
        user_id: userId,
      })

      setName('')
      setDuration('30')
      setPrice('0')
      success('Serviço criado com sucesso!')
      router.refresh()
    } catch (err) {
      console.error('Error creating service:', err)
      error('Falha ao criar serviço. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className="label">Nome do Serviço</label>
        <input
          type="text"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Corte de cabelo, Massagem"
          required
        />
      </div>

      <div className="mb-5">
        <label className="label">Preço (R$)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0,00"
          required
        />
      </div>

      <div className="mb-6">
        <label className="label">Duração</label>
        <div className="relative">
          <select
            className="input appearance-none"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          >
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="60">1 hora</option>
            <option value="90">1.5 horas</option>
            <option value="120">2 horas</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Adicionando...
          </span>
        ) : 'Adicionar Serviço'}
      </button>
    </form>
  )
}
