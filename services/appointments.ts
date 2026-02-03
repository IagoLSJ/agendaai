import { createClient } from '@/lib/supabase/server'
import { AppointmentInsert, TimeSlot } from '@/types'
import {
  generateTimeSlots,
  markAvailableSlots,
  getDayOfWeek,
} from '@/lib/utils/scheduling'

export async function getAppointmentsByUser(
  userId: string,
  filters?: { startDate?: string; endDate?: string }
) {
  const supabase = await createClient()

  let query = supabase
    .from('appointments')
    .select(
      `
      *,
      services (
        name,
        duration
      )
    `
    )
    .eq('user_id', userId)
    .neq('status', 'cancelled')
    .neq('status', 'completed')

  // Apply filters or default to upcoming
  if (filters?.startDate) {
    query = query.gte('date', filters.startDate)
  } else {
    // Default: Show upcoming appointments from today
    query = query.gte('date', new Date().toISOString().split('T')[0])
  }

  if (filters?.endDate) {
    query = query.lte('date', filters.endDate)
  }

  const { data, error } = await query
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

export async function getAvailableTimeSlots(
  userId: string,
  serviceId: string,
  date: string
): Promise<TimeSlot[]> {
  const supabase = await createClient()

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
  const allSlots = generateTimeSlots(
    (businessHours as any).start_time,
    (businessHours as any).end_time
  )

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
  const supabase = await createClient()

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
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments')
    // @ts-expect-error - Supabase type inference bug
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('appointments').delete().eq('id', id)

  if (error) throw error
}
