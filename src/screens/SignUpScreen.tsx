import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { supabase } from '../../lib/supabase'
import LoadingIndicator from '../components/LoadingIndicator'
import { handleError } from '../utils/common'

const SignUpScreen = (): JSX.Element => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  const onSignUpPress = async (): Promise<void> => {
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        handleError(error, 'Sign-up Failed')
      } else if (data.user?.identities?.length === 0) {
        handleError('Email already exists', 'Sign-up Failed')
      } else {
        Alert.alert(
          'Sign-up Success',
          'Please check your email for confirmation'
        )
      }
    } catch (error) {
      handleError(error, 'Sign-up Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='bg-white h-full w-full'>
      {loading ? (
        <LoadingIndicator size='large' className='mt-16' />
      ) : (
        <>
          <StatusBar style='light' />
          <Image
            className='h-full w-full absolute'
            source={require('../../assets/images/background.png')}
          />

          <View className='flex-row justify-around w-full absolute'>
            <Animated.Image
              entering={FadeInUp.delay(200).duration(1000).springify()}
              source={require('../../assets/images/light3.png')}
              className='h-[200] w-[80]'
            />
            <Animated.Image
              entering={FadeInUp.delay(400).duration(1000).springify()}
              source={require('../../assets/images/light3.png')}
              className='h-[160] w-[65] opacity-75'
            />
          </View>

          <View className='h-full w-full flex justify-around pt-40 pb-10'>
            <View className='flex items-center'>
              <Animated.Image
                entering={FadeInUp.delay(400).duration(1000).springify()}
                source={require('../../assets/images/logo-mobile3.png')}
                className='h-[160] w-[65] opacity-75'
                style={{ width: hp(20), height: hp(20) }}
              />

              <Animated.Text
                entering={FadeInUp.duration(1000).springify()}
                className='text-orange-500 font-bold tracking-wider'
                style={{ fontSize: hp(3.5), letterSpacing: hp(0.3) }}
              >
                Register
              </Animated.Text>
            </View>

            <View className='flex items-center mx-5 space-y-4'>
              <Animated.View
                entering={FadeInDown.duration(1000).springify()}
                className='bg-black/5 p-5 rounded-2xl w-full'
              >
                <TextInput
                  autoCapitalize='none'
                  placeholder='Full name'
                  placeholderTextColor={'gray'}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </Animated.View>

              <Animated.View
                entering={FadeInDown.duration(1000).springify()}
                className='bg-black/5 p-5 rounded-2xl w-full'
              >
                <TextInput
                  autoCapitalize='none'
                  placeholder='Email'
                  placeholderTextColor={'gray'}
                  value={email}
                  onChangeText={setEmail}
                />
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(200).duration(1000).springify()}
                className='bg-black/5 p-5 rounded-2xl w-full mb-3'
              >
                <TextInput
                  placeholder='Password'
                  placeholderTextColor={'gray'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Animated.View>

              <Animated.View
                className='w-full'
                entering={FadeInDown.delay(400).duration(1000).springify()}
              >
                <TouchableOpacity
                  onPress={() => {
                    void onSignUpPress()
                  }}
                  className='w-full bg-sky-400 p-3 rounded-2xl mb-3'
                  disabled={loading}
                >
                  <Text className='text-xl font-bold text-white text-center'>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(800).duration(1000).springify()}
                className='flex-row justify-center'
              >
                <Text>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.replace('/login')
                  }}
                >
                  <Text className='text-sky-600'>Login</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

export default SignUpScreen
