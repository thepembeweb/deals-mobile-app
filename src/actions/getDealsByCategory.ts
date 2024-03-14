import { supabase } from '../../lib/supabase'
import { type Deal, type UnknownOutputParams } from '../types/supabase'
import { SELECT_DEALS_QUERY } from './queries'

const getDealsByCategory = async (
  searchParams: UnknownOutputParams
): Promise<Deal[]> => {
  let query = supabase.from('deals').select(SELECT_DEALS_QUERY)

  if (searchParams.search !== undefined && searchParams.search !== '') {
    query = query.ilike('title', `%${searchParams.search}%`)
  }
  if (searchParams.title !== undefined && searchParams.title !== '') {
    query = query.eq('categories.title', searchParams.title)
  }
  if (searchParams.minPrice !== undefined && searchParams.minPrice !== '') {
    query = query.gte('final_price', searchParams.minPrice)
  }
  if (searchParams.maxPrice !== undefined && searchParams.maxPrice !== '') {
    query = query.lt('final_price', searchParams.maxPrice)
  }
  if (
    searchParams.specialOffers !== undefined &&
    typeof searchParams.specialOffers === 'string' &&
    searchParams.specialOffers !== ''
  ) {
    query = query.in(
      'deal_special_offers.special_offer_id',
      searchParams.specialOffers.split(',')
    )
  }

  const { data, error } = await query

  if (error != null) {
    console.log(error.message)
  }

  return (data as unknown as Deal[]) ?? []
}

export default getDealsByCategory
