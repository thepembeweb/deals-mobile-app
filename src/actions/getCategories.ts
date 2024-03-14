import { supabase } from '../../lib/supabase'
import { type Category } from '../types/supabase'

const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: false })

  if (error !== null) {
    console.log(error.message)
  }

  return (data as unknown as Category[]) ?? []
}

export default getCategories
