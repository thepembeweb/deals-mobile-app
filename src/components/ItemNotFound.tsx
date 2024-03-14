import React from 'react'
import { Image, Text, View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

interface ItemNotFoundProps {
  message: string
}

const ItemNotFound: React.FC<ItemNotFoundProps> = ({ message }) => {
  return (
    <View className='flex justify-center items-center my-5 space-y-3'>
      <Shadow>
        <Image
          className='w-36 h-36'
          source={require('../../assets/images/empty.png')}
        />
      </Shadow>

      <Text className='font-bold text-neutral-500'>
        {message || 'item not found'}
      </Text>
    </View>
  )
}

export default ItemNotFound
