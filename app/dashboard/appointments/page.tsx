import { getCurrentUser } from '@/services/users'
import { getAppointmentsByUser } from '@/services/appointments'
import { formatDate, formatTime } from '@/lib/utils/scheduling'
import { redirect } from 'next/navigation'
import AppointmentActions from '@/components/AppointmentActions'

export default async function AppointmentsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const appointments = await getAppointmentsByUser(user.id)

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-1 sm:mb-2">
              Seus Agendamentos
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-secondary-500">
              Gerencie e acompanhe seus horários marcados
            </p>
          </div>
          <button className="btn btn-primary w-full sm:w-auto shadow-xl shadow-primary-500/20 text-sm sm:text-base">
            <span className="sm:hidden">Novo Agendamento</span>
            <span className="hidden sm:inline">+ Novo Agendamento</span>
          </button>
        </div>

        {/* Empty State */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-secondary-100 p-6 sm:p-8 lg:p-12 text-center shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-sm sm:text-base text-secondary-500 mb-6 sm:mb-8 max-w-sm mx-auto px-4">
              Você ainda não tem nenhum horário agendado. Que tal marcar um agora?
            </p>
            <button className="btn btn-primary w-full sm:w-auto">
              Agendar Horário
            </button>
          </div>
        ) : (
          /* Appointments List */
          <div className="grid gap-3 sm:gap-4 lg:gap-6">
            {(appointments as any[]).map((appointment) => (
              <div
                key={appointment.id}
                className="group bg-white rounded-xl sm:rounded-2xl border border-secondary-100 p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary-100"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-6">
                  {/* Date Box - Desktop/Tablet */}
                  <div className="hidden sm:flex flex-shrink-0 flex-col items-center justify-center w-20 lg:w-24 bg-primary-50 rounded-xl p-3 lg:p-4 border border-primary-100">
                    <span className="text-xs lg:text-sm font-semibold text-primary-600 uppercase tracking-wider">
                      {new Date(appointment.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </span>
                    <span className="text-2xl lg:text-3xl font-bold text-primary-900 leading-none my-1">
                      {new Date(appointment.date).getDate()}
                    </span>
                    <span className="text-xs text-primary-500 font-medium">
                      {new Date(appointment.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Mobile Date Header */}
                    <div className="flex sm:hidden items-center justify-between mb-3 pb-3 border-b border-secondary-100">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-lg border border-primary-100">
                          <span className="text-lg font-bold text-primary-900">
                            {new Date(appointment.date).getDate()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-primary-600 uppercase">
                            {new Date(appointment.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                          </span>
                          <span className="text-xs text-secondary-500">
                            {new Date(appointment.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge - Mobile */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide
                        ${appointment.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' :
                          appointment.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                            appointment.status === 'completed' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                              'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                          ${appointment.status === 'confirmed' ? 'bg-green-500' :
                            appointment.status === 'cancelled' ? 'bg-red-500' :
                              appointment.status === 'completed' ? 'bg-gray-500' :
                                'bg-yellow-500'}`}
                        />
                        {appointment.status === 'confirmed' ? 'Confirmado' :
                          appointment.status === 'cancelled' ? 'Cancelado' :
                            appointment.status === 'completed' ? 'Concluído' : appointment.status}
                      </span>
                    </div>

                    {/* Title and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-secondary-900 mb-1.5 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {appointment.client_name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-secondary-500">
                          <span className="font-medium text-secondary-700 line-clamp-1">
                            {(appointment.services as any)?.name}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-secondary-500">
                            {(appointment.services as any)?.duration} min
                          </span>
                        </div>
                      </div>

                      {/* Status Badge - Desktop */}
                      <span className={`hidden sm:inline-flex self-start items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap
                        ${appointment.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' :
                          appointment.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                            appointment.status === 'completed' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                              'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 
                          ${appointment.status === 'confirmed' ? 'bg-green-500' :
                            appointment.status === 'cancelled' ? 'bg-red-500' :
                              appointment.status === 'completed' ? 'bg-gray-500' :
                                'bg-yellow-500'}`}
                        />
                        {appointment.status === 'confirmed' ? 'Confirmado' :
                          appointment.status === 'cancelled' ? 'Cancelado' :
                            appointment.status === 'completed' ? 'Concluído' : appointment.status}
                      </span>
                    </div>

                    {/* Info Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-3 pt-3 border-t border-secondary-50">
                      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-600">
                          <svg className="w-4 h-4 flex-shrink-0 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{formatTime(appointment.start_time)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-600">
                          <svg className="w-4 h-4 flex-shrink-0 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="truncate">{appointment.client_whatsapp}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      {appointment.status === 'confirmed' && (
                        <div className="sm:ml-auto sm:pl-6 sm:border-l sm:border-secondary-100">
                          <AppointmentActions appointmentId={appointment.id} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}