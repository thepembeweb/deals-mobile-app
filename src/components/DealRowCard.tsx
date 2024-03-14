import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import useLoadImage from '../hooks/useLoadImage'
import { type Deal } from '../types/supabase'
import { formatToOneDecimalPlace } from '../utils/common'
import { BLUR_HASH, IMAGES_DEALS_BUCKET } from '../utils/constants'

interface DealRowCardProps {
  deal: Deal
}

const DealRowCard: React.FC<DealRowCardProps> = ({ deal }) => {
  const router = useRouter()
  const imageUrl = useLoadImage(
    IMAGES_DEALS_BUCKET,
    deal.featured_image_url ?? ''
  )
  const formattedSrc = imageUrl ?? 'https://picsum.photos/300'

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        router.push({
          pathname: `/home/${deal.id}`,
          params: {
            featuredImageUrl: formattedSrc,
            sharedTransitionTag: deal.sharedTransitionTag ?? '',
          },
        })
      }}
    >
      <View
        // style={{ shadowColor: "rgba(30, 41, 59, 0.2", shadowRadius: 7 }}
        className='mr-6 bg-white rounded-2xl shadow-lg'
      >
        <View className='center' style={{ overflow: 'hidden' }}>
          <Image
            className='h-36 w-full rounded-t-2xl mx-auto'
            style={{ aspectRatio: 1, resizeMode: 'cover' }}
            source={formattedSrc}
            placeholder={BLUR_HASH}
            contentFit='cover'
            transition={1000}
          />
        </View>

        <View className='px-3 pb-4 space-y-2'>
          <Text style={{ fontSize: hp(2) }} className='font-bold pt-2'>
            {deal.title.length > 30
              ? deal.title.slice(0, 30) + '...'
              : deal.title}
          </Text>
          <View className='flex-row items-center space-x-1'>
            <Image
              source={require('../../assets/images/fullStar.png')}
              className='h-4 w-4'
            />
            <Text style={{ fontSize: hp(1.8) }}>
              <Text className='text-green-700'>
                {formatToOneDecimalPlace(deal.rating!)}
              </Text>
              <Text className='text-gray-700'>
                {' '}
                ({deal.popularity} reviews)
              </Text>{' '}
              ·{' '}
              <Text className='font-semibold text-gray-700'>
                {deal.categories.title}
              </Text>
            </Text>
          </View>
          <View className='flex-row items-center space-x-1'>
            <Text style={{ fontSize: hp(1.7) }} className='font-semibold'>
              ₹{deal.final_price}
            </Text>
            <Text
              style={{ fontSize: hp(1.5) }}
              className='font-semibold text-green-600 line-through'
            >
              ₹{deal.actual_price}
            </Text>
            <Text
              style={{ fontSize: hp(1.5) }}
              className='font-semibold text-green-600'
            >
              ({deal.discount_percent}% off)
            </Text>
          </View>
          {/* <View className="flex-row items-center space-x-1">
            <MapPinIcon color="gray" width={15} height={15} />
            <Text style={{ fontSize: hp(1.8) }} className="text-gray-700">
              {" "}
              Nearby · {"the address"}
            </Text>
          </View> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default DealRowCard
