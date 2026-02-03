import { getCurrentUser } from '@/services/users'
import { getFinancialStats } from '@/services/finance'
import { redirect } from 'next/navigation'

export default async function FinancePage() {
    const user = await getCurrentUser()
    if (!user) {
        redirect('/login')
    }

    const stats = await getFinancialStats(user.id)

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

    return (
        <div className="w-full min-h-screen">
            <div className="max-w-6xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
                <div className="mb-6 sm:mb-8 border-b border-secondary-200 pb-4 sm:pb-6">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-2">
                        Financeiro
                    </h2>
                    <p className="text-secondary-500 text-sm sm:text-base lg:text-lg">
                        Acompanhe seus ganhos e transações recentes
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    {/* Today */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                        <h3 className="text-sm font-medium text-secondary-500 mb-2">
                            Ganhos Hoje
                        </h3>
                        <p className="text-3xl font-bold text-primary-600">
                            {formatter.format(stats.today)}
                        </p>
                    </div>

                    {/* This Week */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                        <h3 className="text-sm font-medium text-secondary-500 mb-2">
                            Esta Semana
                        </h3>
                        <p className="text-3xl font-bold text-primary-600">
                            {formatter.format(stats.week)}
                        </p>
                    </div>

                    {/* This Month */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                        <h3 className="text-sm font-medium text-secondary-500 mb-2">
                            Este Mês
                        </h3>
                        <p className="text-3xl font-bold text-primary-600">
                            {formatter.format(stats.month)}
                        </p>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-secondary-100 bg-secondary-50">
                        <h3 className="font-bold text-secondary-900">Transações Recentes</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Serviço
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Valor
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                                {stats.recentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-secondary-500">
                                            Nenhuma transação encontrada neste período.
                                        </td>
                                    </tr>
                                ) : (
                                    stats.recentTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-secondary-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                                                {new Date(t.date + 'T12:00:00').toLocaleDateString('pt-BR')} <span className="text-secondary-400 text-xs ml-1">{t.startTime}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 font-medium">
                                                {t.clientName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                                {t.serviceName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                {formatter.format(t.amount)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
