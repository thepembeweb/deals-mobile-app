import { supabase } from '../../lib/supabase'
import { type User } from '../types/supabase'

const getUser = async (): Promise<User | null> => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    console.log(sessionError.message)
    return null
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', sessionData.session?.user.id)
    .single()

  if (error) {
    console.log(error.message)
  }

  return (data as unknown as User) || null
}

export default getUser
