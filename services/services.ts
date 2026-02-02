import { createClient } from '@/lib/supabase/server'
import { ServiceInsert } from '@/types'

export async function getServicesByUser(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getServicesBySlug(slug: string) {
  const supabase = await createClient()

  // First get user by slug
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('slug', slug)
    .single()

  if (userError) throw userError

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', (user as any).id)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function getServiceById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createService(data: ServiceInsert) {
  const supabase = await createClient()

  const { data: service, error } = await supabase
    .from('services')
    .insert(data as any)
    .select()
    .single()

  if (error) throw error
  return service
}

export async function updateService(id: string, data: Partial<ServiceInsert>) {
  const supabase = await createClient()

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
  const supabase = await createClient()

  const { error } = await supabase.from('services').delete().eq('id', id)

  if (error) throw error
}
