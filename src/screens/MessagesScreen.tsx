import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'

import getMessages from '../actions/getMessages'
import LoadingIndicator from '../components/LoadingIndicator'
import MessageList from '../components/MessageList'
import { type Message } from '../types/supabase'
import { handleError } from '../utils/common'

const MessagesScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const currentMessages = await getMessages()
      if (currentMessages.length > 0) {
        setMessages(currentMessages)
      }
      setLoading(false)
    } catch (error) {
      handleError(error, 'Error fetching messages')
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
            <MessageList
              title='Messages'
              messages={messages}
              emptyListMessage='No messages ... yet!'
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default MessagesScreen
