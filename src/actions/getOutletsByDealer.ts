import { supabase } from '../../lib/supabase'
import { type Outlet } from '../types/supabase'

const getOutletsByDealer = async (): Promise<Outlet[]> => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    console.log(sessionError.message)
    return []
  }

  const { data: provider, error: selectProviderError } = await supabase
    .from('providers')
    .select('id')
    .eq('user_id', sessionData.session?.user.id)
    .single()

  if (selectProviderError !== null) {
    console.log(selectProviderError.message)
    return []
  }

  const { data: outletIds, error: selectProviderOutletsError } = await supabase
    .from('provider_outlets')
    .select('outlet_id')
    .eq('provider_id', provider.id)
    .order('created_at', { ascending: false })

  if (selectProviderOutletsError) {
    console.log(selectProviderOutletsError.message)
    return []
  }

  if (outletIds && outletIds.length > 0) {
    const { data, error } = await supabase
      .from('outlets')
      .select('*, outlet_images(image_url,sort_order)')
      .in(
        'id',
        outletIds.map((a) => a.outlet_id)
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error.message)
    }

    if (!data) return []

    return (data as unknown as Outlet[]) || []
  }

  return []
}

export default getOutletsByDealer
