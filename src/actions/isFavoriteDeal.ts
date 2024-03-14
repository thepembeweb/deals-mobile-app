import { supabase } from '../../lib/supabase'

const isFavoriteDeal = async (id: string): Promise<boolean> => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    console.log(sessionError.message)
    return false
  }

  const { data, error } = await supabase
    .from('liked_deals')
    .select('*')
    .eq('user_id', sessionData.session?.user.id)
    .eq('deal_id', id)
    .single()

  if (error !== null) {
    console.log(error.message)
    return false
  }

  if (!error && data) {
    return true
  }

  return false
}

export default isFavoriteDeal
