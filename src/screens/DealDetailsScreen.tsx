/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

import { supabase } from '../../lib/supabase'
import { useAuth } from '../../providers/AuthProvider'
import getDealById from '../actions/getDealById'
import isBookedDeal from '../actions/isBookedDeal'
import isFavoriteDeal from '../actions/isFavoriteDeal'
import DealClient from '../components/DealClient'
import LoadingIndicator from '../components/LoadingIndicator'
import { type Deal } from '../types/supabase'
import { handleError } from '../utils/common'
import { BLUR_HASH } from '../utils/constants'

const DealDetailsScreen = (): JSX.Element => {
  const { user } = useAuth()
  const navigation = useNavigation()
  const router = useRouter()
  const { id, featuredImageUrl, sharedTransitionTag } = useLocalSearchParams()

  const [loading, setLoading] = useState(true)
  const [isBooked, setIsBooked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const formattedSrc =
    (featuredImageUrl as string) ?? 'https://picsum.photos/200'

  const [deal, setDeal] = useState<Deal | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const [dealResult, isBookedResult, isLikedResult] = await Promise.all([
        getDealById(String(id)),
        isBookedDeal(String(id)),
        isFavoriteDeal(String(id)),
      ])

      if (dealResult !== null) {
        setDeal(dealResult)
      }

      setIsBooked(isBookedResult)
      setIsLiked(isLikedResult)
    } catch (error) {
      handleError(error, 'Error fetching deal')
    } finally {
      setLoading(false)
    }
  }, [id])

  useFocusEffect(
    useCallback(() => {
      void fetchData()
      return () => {}
    }, [fetchData])
  )

  const onBookADeal = async (): Promise<void> => {
    if (!user) {
      router.push('/login')
      return
    }

    if (deal && user) {
      const { error } = await supabase.from('deal_bookings').insert({
        deal_id: deal.id,
        user_id: user.id,
        deal_booking_status_id: 1,
      })

      if (error) {
        Alert.alert(error.message)
        return
      }

      Alert.alert('Deal booked successfully!')
    }
  }

  const onAddDealToFavorites = async (): Promise<void> => {
    if (!user) {
      router.push('/login')
      return
    }

    if (deal && user) {
      if (isLiked) {
        const { error } = await supabase
          .from('liked_deals')
          .delete()
          .eq('user_id', user.id)
          .eq('deal_id', deal.id)

        if (error) {
          Alert.alert(error.message)
        } else {
          setIsLiked(false)
        }
      } else {
        const { error } = await supabase.from('liked_deals').insert({
          deal_id: deal.id,
          user_id: user.id,
        })

        if (error) {
          Alert.alert(error.message)
        } else {
          setIsLiked(true)
        }
      }
    }
  }

  return (
    <View className='flex-1'>
      <ScrollView
        className='bg-white flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <StatusBar style={'light'} />
        <View className='flex-row justify-center'>
          <Image
            className='h-36 w-full rounded-t-2xl mx-auto'
            style={{
              width: wp(98),
              height: hp(50),
              borderRadius: 5,
              marginTop: 4,
            }}
            source={formattedSrc}
            placeholder={BLUR_HASH}
            contentFit='cover'
            transition={1000}
          />
        </View>

        <Animated.View
          entering={FadeIn.delay(200).duration(1000)}
          className='w-full absolute flex-row justify-between items-center pt-14'
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            className='p-2 rounded-full ml-5 bg-white'
          >
            <FontAwesome5
              name='chevron-left'
              size={hp(3.5)}
              // size={hp(3.5)}
              // strokeWidth={4.5}
              color='#fbbf24'
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              void onAddDealToFavorites()
            }}
            className='p-2 rounded-full mr-5 bg-white'
          >
            {/* <HeartIcon
              size={hp(3.5)}
              strokeWidth={4.5}
              color={isLiked ? 'red' : 'gray'}
            /> */}
            <Ionicons
              name='heart-sharp'
              size={hp(3.5)}
              strokeWidth={4.5}
              color={isLiked ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <LoadingIndicator size='large' className='mt-16' />
        ) : (
          <DealClient deal={deal!} />
        )}
      </ScrollView>
      {!loading && !isBooked && (
        <View className='bg-white border-t border-gray-300 px-6'>
          <View className='mt-3 mb-5'>
            <TouchableOpacity
              className='width-full bg-red-500 py-4 px-9 rounded-full'
              onPress={() => {
                void onBookADeal()
              }}
            >
              <Text
                style={{ fontSize: hp(1.8) }}
                className='font-semibold text-white text-center'
              >
                Book this Deal!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

export default DealDetailsScreen
