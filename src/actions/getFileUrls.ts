import { supabase } from '../../lib/supabase'
import { type FileUrl } from '../types/supabase'

const getFileUrls = async (
  bucketId: string,
  folder: string,
  paths: string[]
): Promise<FileUrl[]> => {
  const files = []
  for (const path of paths) {
    const { data: imageData } = supabase.storage
      .from(`${bucketId}/${folder}`)
      .getPublicUrl(path)

    const { data: fileData, error } = await supabase.storage
      .from(bucketId)
      .list(folder, {
        limit: 2,
        search: path,
      })

    if (error) {
      console.log(error.message)
    }

    files.push({
      publicUrl: imageData.publicUrl,
      file: fileData && fileData.length > 0 ? fileData[0] : null,
    })
  }

  const fileUrls = files.map((file) => {
    return {
      url: file.publicUrl,
      name: file.file?.name ?? '',
      mimeType: file.file?.metadata.mimetype ?? '',
    }
  })

  return (fileUrls as any) || []
}

export default getFileUrls
