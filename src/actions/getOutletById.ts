import { supabase } from '../../lib/supabase'
import { type Outlet } from '../types/supabase'

const getOutletById = async (id: string): Promise<Outlet | null> => {
  const { data, error } = await supabase
    .from('outlets')
    .select('*, outlet_images(image_url,sort_order)')
    .eq('id', id)
    .single()

  if (error !== null) {
    console.log(error.message)
  }

  return (data as unknown as Outlet) ?? null
}

export default getOutletById
