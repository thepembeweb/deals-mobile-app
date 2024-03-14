import { supabase } from '../../lib/supabase'
import { type Deal } from '../types/supabase'
import getDeals from './getDeals'

const getDealsByTitle = async (title: string): Promise<Deal[]> => {
  if (title === '') {
    const allDeals = await getDeals()
    return allDeals
  }

  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .ilike('title', `%${title}%`)
    .order('created_at', { ascending: false })

  if (error !== null) {
    console.log(error.message)
  }

  return data ?? []
}

export default getDealsByTitle
