import { supabase } from '../../lib/supabase'
import { type Notification } from '../types/supabase'
import { SELECT_NOTIFICATIONS_QUERY } from './queries'

const getNotifications = async (): Promise<Notification[]> => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    console.log(sessionError.message)
    return []
  }

  const { data, error } = await supabase
    .from('notifications')
    .select(SELECT_NOTIFICATIONS_QUERY)
    .eq('user_id', sessionData.session?.user.id)
    .order('created_at', { ascending: false })

  if (error !== null) {
    console.log(error.message)
  }

  return (data as unknown as Notification[]) ?? []
}

export default getNotifications
