import { supabase } from '../../lib/supabase'
import { type Deal } from '../types/supabase'
import { SELECT_DEAL_QUERY } from './queries'

const getDealById = async (id: string): Promise<Deal | null> => {
  const { data, error } = await supabase
    .from('deals')
    .select(SELECT_DEAL_QUERY)
    .eq('id', id)
    .single()

  if (error !== null) {
    console.log(error.message)
  }

  return (data as unknown as Deal) ?? null
}

export default getDealById
