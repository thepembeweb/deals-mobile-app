import { supabase } from '../../lib/supabase'
import { type SpecialOffer } from '../types/supabase'

const getSpecialOffers = async (): Promise<SpecialOffer[]> => {
  const { data, error } = await supabase
    .from('special_offers')
    .select('*')
    .order('sort_order', { ascending: false })

  if (error !== null) {
    console.log(error.message)
  }

  return (data as unknown as SpecialOffer[]) ?? []
}

export default getSpecialOffers
