import { supabase } from '../lib/supabase'

export async function getHabits() {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('category')

  if (error) {
    console.error('Error fetching habits:', error)
    return []
  }

  return data
}