import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'

import getUser from '../actions/getUser'
import LoadingIndicator from '../components/LoadingIndicator'
import ProfileClient from '../components/ProfileClient'
import { type User } from '../types/supabase'
import { handleError } from '../utils/common'

const ProfileScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const currentUser = await getUser()
      if (currentUser) {
        setUser(currentUser)
      }
    } catch (error) {
      handleError(error, 'Error fetching user')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void fetchData()
      return () => {}
    }, [fetchData])
  )

  return (
    <SafeAreaView className='flex-1 top-14'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className='space-y-6 pt-3'
      >
        {loading ? (
          <LoadingIndicator size='large' className='mt-16' />
        ) : (
          <View>
            <ProfileClient title='Profile' user={user!} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen
