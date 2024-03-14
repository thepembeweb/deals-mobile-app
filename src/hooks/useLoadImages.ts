import { supabase } from '../../lib/supabase'

const useLoadImages = (bucketId: string, paths: string[]): string[] | null => {
  if (bucketId.length === 0 || paths.length === 0) {
    return null
  }

  const publicUrls = paths.map((path) => {
    const { data: imageData } = supabase.storage
      .from(bucketId)
      .getPublicUrl(path)

    return imageData.publicUrl
  })

  return publicUrls
}

export default useLoadImages
