import { getCurrentUser } from '@/services/users'
import { getBusinessHoursByUser } from '@/services/business-hours'
import { redirect } from 'next/navigation'
import BusinessHoursForm from '@/components/BusinessHoursForm'

export default async function BusinessHoursPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const businessHours = await getBusinessHoursByUser(user.id)

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-6xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 border-b border-secondary-200 pb-4 sm:pb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-2">
            Horário de Funcionamento
          </h2>
          <p className="text-secondary-500 text-sm sm:text-base lg:text-lg">
            Defina seu horário de trabalho para cada dia da semana
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto lg:mx-0">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-primary-500/5 p-4 sm:p-6 lg:p-8 border border-secondary-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-secondary-900">
                Configure seus Horários
              </h3>
            </div>
            
            <BusinessHoursForm userId={user.id} existingHours={businessHours} />
          </div>
        </div>

        {/* Optional: Info Card */}
        <div className="max-w-2xl mx-auto lg:mx-0 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm sm:text-base text-blue-900 font-medium mb-1">
                  Dica de uso
                </p>
                <p className="text-xs sm:text-sm text-blue-700">
                  Os horários definidos aqui serão usados para calcular a disponibilidade de agendamentos. 
                  Marque como fechado os dias em que não atende.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}