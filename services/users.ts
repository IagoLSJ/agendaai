import { createClient } from '@/lib/supabase/server'
import { User } from '@/types'

export async function getCurrentUser(): Promise<User> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) throw new Error('User not found')

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (error) throw error
  return user
}

export async function getUserBySlug(slug: string): Promise<User> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function updateUser(
  id: string,
  data: { name?: string; business_name?: string; slug?: string }
) {
  const supabase = await createClient()

  const { data: user, error } = await supabase
    .from('users')
    // @ts-expect-error - Supabase type inference bug
    .update(data as any)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return user
}
