import { Ionicons } from '@expo/vector-icons'
import { type FileObject } from '@supabase/storage-js'
import { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import { supabase } from '../../lib/supabase'

const ImageItem = ({
  item,
  userId,
  onRemoveImage,
}: {
  item: FileObject
  userId: string
  onRemoveImage: () => void
}): JSX.Element => {
  const [image, setImage] = useState<string>('')

  supabase.storage
    .from('images/users')
    .download(`${userId}/${item.name}`)
    .then(({ data }) => {
      const fr = new FileReader()
      fr.readAsDataURL(data!)
      fr.onload = () => {
        setImage(fr.result as string)
      }
    })

  return (
    <View
      style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}
    >
      {image ? (
        <Image style={{ width: 80, height: 80 }} source={{ uri: image }} />
      ) : (
        <View style={{ width: 80, height: 80, backgroundColor: '#1A1A1A' }} />
      )}
      <Text style={{ flex: 1, color: '#fff' }}>{item.name}</Text>
      <TouchableOpacity onPress={onRemoveImage}>
        <Ionicons name='trash-outline' size={20} color={'#fff'} />
      </TouchableOpacity>
    </View>
  )
}

export default ImageItem
