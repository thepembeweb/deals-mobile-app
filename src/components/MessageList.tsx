/* eslint-disable max-len */
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useNavigation } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { type Message } from '../types/supabase'
import EmptyList from './EmptyList'
import LoadingIndicator from './LoadingIndicator'
import MessageCard from './MessageCard'

interface MessageListProps {
  title: string
  messages: Message[]
  emptyListMessage?: string
}

const MessageList: React.FC<MessageListProps> = ({
  title,
  messages,
  emptyListMessage = 'No results found.',
}) => {
  const navigation = useNavigation()
  return (
    <View className='mx-4 space-y-3 mb-16'>
      <View className='flex-row'>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className='flex-row items-center justify-center mr-2'
        >
          <Feather color='#000' name='arrow-left' size={18} />
        </TouchableOpacity>

        <Text
          style={{ fontSize: hp(3) }}
          className='font-semibold text-neutral-600'
        >
          {title}
        </Text>
      </View>

      <View>
        {messages.length === 0 ? (
          <LoadingIndicator size='large' className='mt-20' />
        ) : (
          <View style={{ flexGrow: 1, flexDirection: 'row', minHeight: 2 }}>
            <FlashList
              data={messages}
              numColumns={1}
              ListEmptyComponent={
                <EmptyList message={"You haven't recorded any trips yet"} />
              }
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              // columnWrapperStyle={{
              //   justifyContent: "space-between",
              // }}
              className='mx-1'
              estimatedItemSize={97}
              renderItem={({ item, index }) => {
                return (
                  <MessageCard key={item.id} message={item} index={index} />
                )
              }}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default MessageList
