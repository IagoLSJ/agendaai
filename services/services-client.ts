import { createClient } from '@/lib/supabase/client'
import { ServiceInsert } from '@/types'
import { Database } from '@/types/database.types'

export async function createService(data: ServiceInsert) {
    const supabase = createClient()

    const { data: service, error } = await supabase
        .from('services')
        .insert(data as any)
        .select()
        .single()

    if (error) throw error
    return service
}

export async function updateService(id: string, data: Partial<ServiceInsert>) {
    const supabase = createClient()

    const { data: service, error } = await supabase
        .from('services')
        // @ts-expect-error - Supabase type inference bug
        .update(data as any)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return service
}

export async function deleteService(id: string) {
    const supabase = createClient()

    // Check for future/active appointments
    const today = new Date().toISOString().split('T')[0]
    const { data: activeAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('service_id', id)
        .eq('status', 'confirmed')
        .gte('date', today)

    if (checkError) throw checkError

    if (activeAppointments && activeAppointments.length > 0) {
        throw new Error('PENDING_APPOINTMENTS')
    }

    // Check if there are ANY appointments (history)
    const { count, error: countError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('service_id', id)

    if (countError) throw countError

    if (count && count > 0) {
        // Soft delete (archive)
        const { error: updateError } = await supabase
            .from('services')
            // @ts-expect-error - Supabase type inference bug
            .update({ active: false } as any)
            .eq('id', id)

        if (updateError) throw updateError
    } else {
        // Hard delete
        const { error: deleteError } = await supabase
            .from('services')
            .delete()
            .eq('id', id)

        if (deleteError) throw deleteError
    }
}
