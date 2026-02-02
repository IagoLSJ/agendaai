import { getUserBySlug } from '@/services/users'
import { getServicesBySlug } from '@/services/services'
import { notFound } from 'next/navigation'
import BookingFlow from '@/components/BookingFlow'

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const user = await getUserBySlug(slug)
    const services = await getServicesBySlug(slug)

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-purple-50">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary-200/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-200/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            {/* Business Logo/Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-primary-500/10 mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Business Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
              {user.business_name}
            </h1>
            
            {/* Subtitle */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-primary-100">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm sm:text-base text-gray-700 font-medium">
                Agende seu horário
              </p>
            </div>
          </div>

          {/* Main Content */}
          {services.length === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-primary-500/5 border border-primary-100 p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Nenhum serviço disponível
              </h3>
              <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                No momento não há serviços disponíveis para agendamento. Por favor, volte mais tarde.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-primary-500/5 border border-primary-100 overflow-hidden">
              <BookingFlow 
                services={services} 
                userId={user.id} 
                businessName={user.business_name} 
              />
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Agendamento online seguro</span>
              </div>
              <span className="hidden sm:inline text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Confirmação instantânea</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
} 