import { createClient } from '@/lib/supabase/client'
import { BusinessHourInsert } from '@/types'
import { Database } from '@/types/database.types'

export async function upsertBusinessHours(
    userId: string,
    hours: Omit<BusinessHourInsert, 'user_id'>[]
) {
    const supabase = createClient()

    const hoursWithUser = hours.map((h) => ({ ...h, user_id: userId }))

    const { data, error } = await supabase
        .from('business_hours')
        .upsert(hoursWithUser as any, {
            onConflict: 'user_id,day_of_week'
        })
        .select()

    if (error) throw error
    return data
}

export async function deleteBusinessHour(id: string) {
    const supabase = createClient()

    const { error } = await supabase.from('business_hours').delete().eq('id', id)

    if (error) throw error
}
