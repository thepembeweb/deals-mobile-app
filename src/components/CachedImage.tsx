import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { type ImageProps, type ImageSourcePropType } from 'react-native'
import Animated from 'react-native-reanimated'

type CachedImageProps = Omit<ImageProps, 'source'> & {
  uri: string
  sharedTransitionTag?: string
}

const CachedImage: React.FC<CachedImageProps> = ({ uri, ...props }) => {
  const [cachedSource, setCachedSource] = useState<{ uri: string } | null>({
    uri,
  })

  useEffect(() => {
    const getCachedImage = async (): Promise<void> => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri)
        if (cachedImageData !== null && cachedImageData !== '') {
          setCachedSource({ uri: cachedImageData })
        } else {
          await AsyncStorage.setItem(uri, uri)
          setCachedSource({ uri })
        }
      } catch (error) {
        console.error('Failed to load cached image:', error)
        setCachedSource({ uri })
      }
    }

    void getCachedImage()
  }, [])

  return (
    <Animated.Image {...props} source={cachedSource as ImageSourcePropType} />
  )
}

export default CachedImage
