import { supabase } from '../../lib/supabase'
import { type Deal } from '../types/supabase'
import { SELECT_DEALS_QUERY } from './queries'

const getDeals = async (): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select(SELECT_DEALS_QUERY)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error !== null) {
    console.log(error.message)
  }

  return (data as unknown as Deal[]) ?? []
}

export default getDeals
