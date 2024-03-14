import { supabase } from '../../lib/supabase'

const useLoadImage = (bucketId: string, path: string): string | null => {
  if (bucketId.length === 0 || path.length === 0) {
    return null
  }

  const { data: imageData } = supabase.storage.from(bucketId).getPublicUrl(path)

  return imageData.publicUrl
}

export default useLoadImage
