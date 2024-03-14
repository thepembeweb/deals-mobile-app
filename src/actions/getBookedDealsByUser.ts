import { supabase } from '../../lib/supabase'
import { type Deal } from '../types/supabase'
import { SELECT_DEALS_QUERY } from './queries'

const getBookedDealsByUser = async (): Promise<Deal[]> => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    console.log(sessionError.message)
    return []
  }

  const { data: dealIds, error: selectBookedDealsError } = await supabase
    .from('deal_bookings')
    .select('deal_id')
    .eq('user_id', sessionData.session?.user.id)
    .order('created_at', { ascending: false })

  if (selectBookedDealsError) {
    console.log(selectBookedDealsError.message)
    return []
  }

  if (dealIds && dealIds.length > 0) {
    const { data, error } = await supabase
      .from('deals')
      .select(SELECT_DEALS_QUERY)
      .in(
        'id',
        dealIds.map((a) => a.deal_id)
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error.message)
    }

    return (data as unknown as Deal[]) ?? []
  }

  return []
}

export default getBookedDealsByUser
