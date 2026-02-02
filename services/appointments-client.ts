import { createClient } from '@/lib/supabase/client'
import { AppointmentInsert, TimeSlot } from '@/types'
import { Database } from '@/types/database.types'
import {
    generateTimeSlots,
    markAvailableSlots,
    getDayOfWeek,
} from '@/lib/utils/scheduling'

/**
 * Client-side version of appointment services
 * Uses browser Supabase client for use in client components
 */

export async function getAvailableTimeSlots(
    userId: string,
    serviceId: string,
    date: string
): Promise<TimeSlot[]> {
    const supabase = createClient()

    // Get service duration
    const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('duration')
        .eq('id', serviceId)
        .single()

    if (serviceError) throw serviceError

    // Get business hours for the day
    const dayOfWeek = getDayOfWeek(date)
    const { data: businessHours, error: hoursError } = await supabase
        .from('business_hours')
        .select('start_time, end_time')
        .eq('user_id', userId)
        .eq('day_of_week', dayOfWeek)
        .single()

    if (hoursError || !businessHours) {
        return [] // Business closed on this day
    }

    // Generate all possible slots
    let allSlots = generateTimeSlots(
        (businessHours as any).start_time,
        (businessHours as any).end_time
    )

    // Filter out past slots if date is today
    const now = new Date()
    const today = now.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')

    if (date === today) {
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()

        allSlots = allSlots.filter(slot => {
            const [slotHour, slotMinute] = slot.split(':').map(Number)
            return slotHour > currentHour || (slotHour === currentHour && slotMinute > currentMinute)
        })
    }

    // Get booked appointments for this date
    const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('start_time, services(duration)')
        .eq('user_id', userId)
        .eq('date', date)
        .neq('status', 'cancelled')

    if (appointmentsError) throw appointmentsError

    // Mark booked slots including their duration
    const bookedSlots: string[] = []
    appointments?.forEach((apt: any) => {
        const duration = apt.services?.duration || 30
        const slotsNeeded = Math.ceil(duration / 30)
        const startIndex = allSlots.indexOf(apt.start_time)

        if (startIndex !== -1) {
            for (let i = 0; i < slotsNeeded; i++) {
                if (allSlots[startIndex + i]) {
                    bookedSlots.push(allSlots[startIndex + i])
                }
            }
        }
    })

    return markAvailableSlots(allSlots, bookedSlots, (service as any).duration)
}

export async function createAppointment(data: AppointmentInsert) {
    const supabase = createClient()

    // Verify slot is still available
    const slots = await getAvailableTimeSlots(
        data.user_id,
        data.service_id,
        data.date
    )

    const slot = slots.find((s) => s.time === data.start_time)
    if (!slot || !slot.available) {
        throw new Error('Este horário não está mais disponível')
    }

    const { data: appointment, error } = await supabase
        .from('appointments')
        .insert(data as any)
        .select()
        .single()

    if (error) throw error
    return appointment
}

export async function updateAppointmentStatus(
    id: string,
    status: 'confirmed' | 'cancelled' | 'completed'
) {
    const supabase = createClient()

    // Type assertion needed due to Supabase's type inference limitations
    // The update method doesn't properly recognize Database schema types
    const { data, error } = await supabase
        .from('appointments')
        // @ts-expect-error - Supabase type inference bug: update parameter incorrectly inferred as 'never'
        .update({ status })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}
