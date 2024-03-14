import { supabase } from '../../lib/supabase'
import { type DealNature } from '../types/supabase'

const getDealNatures = async (): Promise<DealNature[]> => {
  const { data, error } = await supabase
    .from('deal_natures')
    .select('*')
    .order('sort_order', { ascending: false })

  if (error !== null) {
    console.log(error.message)
  }

  return (data as unknown as DealNature[]) ?? []
}

export default getDealNatures
