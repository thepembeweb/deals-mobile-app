import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import useLoadImage from '../hooks/useLoadImage'
import { type Deal } from '../types/supabase'
import { formatToOneDecimalPlace } from '../utils/common'
import { BLUR_HASH, IMAGES_DEALS_BUCKET } from '../utils/constants'

interface DealCardProps {
  deal: Deal
  index: number
  dealPathPrefix: '/deals' | '/favorites' | '/home'
}

const DealCard: React.FC<DealCardProps> = ({ deal, index, dealPathPrefix }) => {
  const router = useRouter()
  const imageUrl = useLoadImage(
    IMAGES_DEALS_BUCKET,
    deal.featured_image_url ?? ''
  )
  const formattedSrc = imageUrl ?? 'https://picsum.photos/300'

  const openDealDetails = (): void => {
    const params = {
      featuredImageUrl: formattedSrc,
      sharedTransitionTag: deal.sharedTransitionTag ?? '',
    }

    if (dealPathPrefix === '/deals') {
      router.push({
        pathname: `/deals/${deal.id}`,
        params,
      })
    }
    if (dealPathPrefix === '/favorites') {
      router.push({
        pathname: `/favorites/${deal.id}`,
        params,
      })
    }
    if (dealPathPrefix === '/home') {
      router.push({
        pathname: `/home/${deal.id}`,
        params,
      })
    }
  }

  return (
    <View>
      <TouchableWithoutFeedback onPress={openDealDetails}>
        <View
          style={{
            width: '100%',
          }}
          className='mr-6 mb-4'
        >
          <Image
            className='rounded-full'
            style={{
              width: '100%',
              height: hp(35),
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
            source={{
              uri: formattedSrc,
            }}
            placeholder={BLUR_HASH}
            contentFit='cover'
            transition={1000}
          />

          <View
            style={{
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}
            className='bg-white px-3 pb-4 space-y-2'
          >
            <Text style={{ fontSize: hp(2) }} className='font-bold pt-2'>
              {deal.title.length > 35
                ? deal.title.slice(0, 35) + '...'
                : deal.title}
            </Text>
            <View className='flex-row items-center space-x-1'>
              <Image
                source={require('../../assets/images/fullStar.png')}
                className='h-4 w-4'
              />
              <Text style={{ fontSize: hp(1.8) }}>
                <Text className='text-green-700'>
                  {formatToOneDecimalPlace(deal.rating ?? 0)}
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
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default DealCard
