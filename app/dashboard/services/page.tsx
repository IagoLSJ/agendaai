import { getCurrentUser } from '@/services/users'
import { getServicesByUser } from '@/services/services'
import { redirect } from 'next/navigation'
import ServiceForm from '@/components/ServiceForm'
import ServiceList from '@/components/ServiceList'
import { User } from '@/types'

export default async function ServicesPage() {
  const user: User = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const services = await getServicesByUser(user.id)

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-6xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 border-b border-secondary-200 pb-4 sm:pb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-2">
            Gerenciar Serviços
          </h2>
          <p className="text-secondary-500 text-sm sm:text-base lg:text-lg">
            Adicione e edite os serviços disponíveis para seus clientes
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Service Form - Mobile First, Sticky on Desktop */}
          <div className="w-full lg:col-span-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-primary-500/5 p-4 sm:p-6 border border-secondary-100">
              <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                <span className="truncate">Novo Serviço</span>
              </h3>
              <ServiceForm userId={user.id} />
            </div>
          </div>

          {/* Service List */}
          <div className="w-full lg:col-span-8">
            <div className="bg-secondary-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-secondary-100">
              <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-4 sm:mb-6">
                Serviços Ativos
              </h3>
              <ServiceList services={services} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}