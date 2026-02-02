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

    const { error } = await supabase.from('services').delete().eq('id', id)

    if (error) throw error
}
