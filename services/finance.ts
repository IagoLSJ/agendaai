export interface FinancialStats {
    today: number
    week: number
    month: number
    recentTransactions: Transaction[]
}

export interface Transaction {
    id: string
    clientName: string
    serviceName: string
    date: string
    startTime: string
    amount: number
    status: string
}

import { createClient } from '@/lib/supabase/server'

export async function getFinancialStats(userId: string): Promise<FinancialStats> {
    const supabase = await createClient()

    const now = new Date()

    // Start of today
    const todayStr = now.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')

    // Start of week (Sunday)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Determine oldest date to fetch
    const earliestDate = startOfWeek < startOfMonth ? startOfWeek : startOfMonth

    const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
      id,
      date,
      start_time,
      client_name,
      status,
      services (
          name,
          price
      )
    `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('date', earliestDate.toISOString().split('T')[0])
        .order('date', { ascending: false })

    if (error) throw error

    let todayTotal = 0
    let weekTotal = 0
    let monthTotal = 0

    const transactions: Transaction[] = []

    appointments?.forEach((apt: any) => {
        const price = apt.services?.price || 0
        const aptDate = new Date(apt.date + 'T12:00:00')

        if (apt.date === todayStr) {
            todayTotal += price
        }

        if (aptDate >= startOfWeek) {
            weekTotal += price
        }

        if (aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()) {
            monthTotal += price
        }

        transactions.push({
            id: apt.id,
            clientName: apt.client_name,
            serviceName: apt.services?.name || 'Serviço',
            date: apt.date,
            startTime: apt.start_time,
            amount: price,
            status: apt.status
        })
    })

    return {
        today: todayTotal,
        week: weekTotal,
        month: monthTotal,
        recentTransactions: transactions.slice(0, 10)
    }
}
