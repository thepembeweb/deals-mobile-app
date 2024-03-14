import React from 'react'
import { Image, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { type Deal } from '../types/supabase'
import { formatToOneDecimalPlace } from '../utils/common'

interface DealClientProps {
  deal: Deal
}

const DealClient: React.FC<DealClientProps> = ({ deal }) => {
  return (
    <View className='px-4 flex justify-between space-y-4 pt-8'>
      <Animated.View
        entering={FadeInDown.duration(700).springify().damping(12)}
        className='space-y-1'
      >
        <Text
          style={{ fontSize: hp(3) }}
          className='font-bold flex-1 text-neutral-700'
        >
          {deal.title}
        </Text>
        {/* <Text
          style={{ fontSize: hp(2) }}
          className='font-medium flex-1 text-neutral-500'
        >
          {(deal.outlets.length > 0 && deal.outlets[0].title) ?? ''}
        </Text> */}

        <View className='flex flex-row items-center gap-1 pt-0'>
          <Text style={{ fontSize: hp(2.5) }} className='font-semibold'>
            ₹{deal.final_price}
          </Text>
          <Text
            style={{ fontSize: hp(1.8) }}
            className='font-semibold text-green-600 line-through'
          >
            ₹{deal.actual_price}
          </Text>
          <Text
            style={{ fontSize: hp(1.8) }}
            className='font-semibold text-green-600'
          >
            ({deal.discount_percent}% off)
          </Text>
        </View>

        <View className='flex-row items-center space-x-1'>
          <Image
            source={require('../../assets/images/fullStar.png')}
            className='h-4 w-4'
          />
          <Text style={{ fontSize: hp(1.8) }}>
            <Text className='text-green-700'>
              {formatToOneDecimalPlace(deal.rating)}
            </Text>
            <Text className='text-gray-700'> ({deal.popularity} reviews)</Text>{' '}
            ·{' '}
            <Text className='font-semibold text-gray-700'>
              {deal.categories.title}
            </Text>
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(700).springify().damping(12)}
        className='flex-row'
      >
        <View>
          <Text style={{ fontSize: hp(1.6) }} className='text-neutral-700'>
            {deal.description}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(700).springify().damping(12)}
        className='space-y-4'
      >
        <View>
          <Text
            style={{ fontSize: hp(1.8) }}
            className='flex-1 text-neutral-700'
          >
            Special Offers
          </Text>
          <View className='space-y-2 ml-3'>
            {deal.special_offers?.map((offer) => {
              return (
                <View
                  key={offer.id}
                  className='flex-row space-x-2 items-center'
                >
                  <View
                    style={{ height: hp(1), width: hp(1) }}
                    className='bg-amber-300 rounded-full'
                  />
                  <View className='flex-row space-x-1'>
                    <Text
                      style={{ fontSize: hp(1.7) }}
                      className='font-medium text-neutral-600'
                    >
                      {offer.title}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
        {deal.brand !== null && (
          <View>
            <Text
              style={{ fontSize: hp(1.8) }}
              className='flex-1 text-neutral-700'
            >
              Brand:{' '}
              <Text
                style={{ fontSize: hp(1.7) }}
                className='font-medium text-neutral-600'
              >
                {deal.brand}
              </Text>
            </Text>
          </View>
        )}
        {deal.model !== null && (
          <View>
            <Text
              style={{ fontSize: hp(1.8) }}
              className='flex-1 text-neutral-700'
            >
              Model:{' '}
              <Text
                style={{ fontSize: hp(1.7) }}
                className='font-medium text-neutral-600'
              >
                {deal.model}
              </Text>
            </Text>
          </View>
        )}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).duration(700).springify().damping(12)}
        className='space-y-3'
      >
        <Text
          style={{ fontSize: hp(2.5) }}
          className='font-bold flex-1 text-neutral-700'
        >
          Specifications
        </Text>
        <Text style={{ fontSize: hp(1.6) }} className='text-neutral-700'>
          {deal.specifications}
        </Text>
      </Animated.View>

      {/* <Animated.View
        className="w-full"
        entering={FadeInDown.delay(400).duration(1000).springify()}
      >
        <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-3">
          <Text className="text-xl font-bold text-white text-center">
            Book this Deal
          </Text>
        </TouchableOpacity>
      </Animated.View> */}
    </View>
  )
}

export default DealClient
