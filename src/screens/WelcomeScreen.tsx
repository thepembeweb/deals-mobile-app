/* eslint-disable max-len */
import { useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { Image, Text, View } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { useAuth } from '../../providers/AuthProvider'
import { useIsFirstTimeUser } from '../hooks'

const WelcomeScreen = (): JSX.Element => {
  const router = useRouter()
  const { session, initialized } = useAuth()
  const segments = useSegments()
  const [isFirstTimeUser] = useIsFirstTimeUser()

  const [isSplashAnimationComplete, setIsSplashAnimationComplete] =
    React.useState(false)
  const ring1padding = useSharedValue(0)
  const ring2padding = useSharedValue(0)

  useEffect(() => {
    ring1padding.value = 0
    ring2padding.value = 0
    setTimeout(
      () => (ring1padding.value = withSpring(ring1padding.value + hp(5))),
      100
    )
    setTimeout(
      () => (ring2padding.value = withSpring(ring2padding.value + hp(5.5))),
      300
    )

    setTimeout(() => {
      setIsSplashAnimationComplete(true)
    }, 2500)
  }, [])

  useEffect(() => {
    if (
      !isSplashAnimationComplete ||
      initialized === false ||
      initialized === undefined ||
      segments[0] === 'signup' ||
      segments[0] === 'onboarding' ||
      segments[0] === '[missing]'
    ) {
      return
    }
    const inAuthGroup = segments[0] === '(tabs)'

    if (session !== null && !inAuthGroup) {
      if (isFirstTimeUser) {
        router.replace('/onboarding')
      } else {
        router.replace('/home')
      }
    } else if (session === null) {
      router.push('/login')
    }
  }, [isSplashAnimationComplete, session, initialized, segments, router])

  return (
    <View className='flex-1 justify-center items-center space-y-10 bg-amber-500'>
      <StatusBar style='light' />

      <Animated.View
        className='bg-white/20 rounded-full'
        style={{ padding: ring2padding }}
      >
        <Animated.View
          className='bg-white/20 rounded-full'
          style={{ padding: ring1padding }}
        >
          <Image
            source={require('../../assets/images/logo-mobile2.png')}
            style={{ width: hp(20), height: hp(20) }}
          />
        </Animated.View>
      </Animated.View>

      <View className='flex items-center space-y-2'>
        <Text
          style={{ fontSize: hp(7) }}
          className='font-bold text-white tracking-widest'
        >
          THIA DEALS
        </Text>
        <Text
          style={{ fontSize: hp(2) }}
          className='font-medium text-white tracking-widest'
        >
          Get deals fast and easy
        </Text>
      </View>
    </View>
  )
}

export default WelcomeScreen
