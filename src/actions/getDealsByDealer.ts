import { supabase } from '../../lib/supabase'
import { type Deal } from '../types/supabase'
import { SELECT_DEALS_QUERY } from './queries'

const getDealsByDealer = async (): Promise<Deal[]> => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    console.log(sessionError.message)
    return []
  }

  const { data, error } = await supabase
    .from('deals')
    .select(SELECT_DEALS_QUERY)
    .eq('user_id', sessionData.session?.user.id)
    .order('created_at', { ascending: false })

  if (error !== null) {
    console.log(error.message)
  }

  return (data as unknown as Deal[]) ?? []
}

export default getDealsByDealer
