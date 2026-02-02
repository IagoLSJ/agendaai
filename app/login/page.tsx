'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [slug, setSlug] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard/appointments')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            business_name: businessName,
            slug,
          },
        },
      })

      if (error) throw error

      router.push('/dashboard/appointments')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-4 sm:p-6 lg:p-8">
      {/* Grain Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* Abstract Shapes - Hidden on mobile for performance */}
      <div className="hidden sm:block absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="hidden sm:block absolute top-10 sm:top-20 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="hidden sm:block absolute -bottom-8 left-1/2 w-48 sm:w-72 h-48 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
            Appointment Scheduler
          </h1>
          <p className="text-primary-100 text-base sm:text-lg">
            {isSignUp
              ? 'Comece sua jornada gratuitamente'
              : 'Bem-vindo de volta'}
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8">
          {/* Toggle Tabs */}
          <div className="mb-5 sm:mb-6 flex space-x-1 p-1 bg-secondary-100 rounded-xl">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                !isSignUp
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-secondary-500 hover:text-secondary-900'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                isSignUp
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-secondary-500 hover:text-secondary-900'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4 sm:space-y-5">
            {/* Sign Up Fields */}
            {isSignUp && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 sm:py-3 bg-secondary-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm sm:text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Nome do Negócio
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 sm:py-3 bg-secondary-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm sm:text-base"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    placeholder="Barbearia do João"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    Slug do Negócio
                  </label>
                  <div className="flex rounded-xl shadow-sm">
                    <span className="inline-flex items-center px-3 sm:px-4 rounded-l-xl border border-r-0 border-secondary-200 bg-secondary-50 text-secondary-500 text-xs sm:text-sm font-medium">
                      /
                    </span>
                    <input
                      type="text"
                      className="flex-1 min-w-0 px-4 py-2.5 sm:py-3 bg-white border border-secondary-200 border-l-0 rounded-r-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm sm:text-base"
                      value={slug}
                      onChange={(e) =>
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                      }
                      placeholder="meu-negocio"
                      required
                    />
                  </div>
                  <p className="text-xs text-secondary-500 mt-1.5">
                    Sua URL: app.com/{slug || '...'}
                  </p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                className="w-full px-4 py-2.5 sm:py-3 bg-secondary-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 sm:py-3 bg-secondary-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl flex items-start sm:items-center gap-2 sm:gap-3 animate-fadeIn">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs sm:text-sm text-red-700 font-medium break-words">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-xl shadow-primary-500/20 hover:shadow-primary-600/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando...</span>
                </div>
              ) : (
                isSignUp ? 'Começar Gratuitamente' : 'Acessar Painel'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-200 mt-6 sm:mt-8 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} Appointment Scheduler
        </p>
      </div>
    </div>
  )
}