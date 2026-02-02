import { createClient } from '@/lib/supabase/server'
import { BusinessHourInsert } from '@/types'

export async function getBusinessHoursByUser(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('business_hours')
    .select('*')
    .eq('user_id', userId)
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data
}

export async function getBusinessHoursBySlug(slug: string) {
  const supabase = await createClient()

  // First get user by slug
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('slug', slug)
    .single()

  if (userError) throw userError

  const { data, error } = await supabase
    .from('business_hours')
    .select('*')
    .eq('user_id', (user as any)?.id)
    .order('day_of_week', { ascending: true })

  if (error) throw error
  return data
}

export async function upsertBusinessHours(
  userId: string,
  hours: Omit<BusinessHourInsert, 'user_id'>[]
) {
  const supabase = await createClient()

  const hoursWithUser = hours.map((h) => ({ ...h, user_id: userId }))

  const { data, error } = await supabase
    .from('business_hours')
    .upsert(hoursWithUser as any, { onConflict: 'user_id,day_of_week' })
    .select()

  if (error) throw error
  return data
}

export async function deleteBusinessHour(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('business_hours').delete().eq('id', id)

  if (error) throw error
}
