import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'

import getNotifications from '../actions/getNotifications'
import LoadingIndicator from '../components/LoadingIndicator'
import NotificationList from '../components/NotificationList'
import { type Notification } from '../types/supabase'
import { handleError } from '../utils/common'

const NotificationsScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const currentNotifications = await getNotifications()
      if (currentNotifications.length > 0) {
        setNotifications(currentNotifications)
      }
      setLoading(false)
    } catch (error) {
      handleError(error, 'Error fetching notifications')
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
            <NotificationList
              title='Notifications'
              notifications={notifications}
              emptyListMessage='No notifications ... yet!'
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default NotificationsScreen
