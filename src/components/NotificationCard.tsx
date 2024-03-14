/* eslint-disable max-len */
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import TimeAgo from '../components/TimeAgo'
import { type Notification } from '../types/supabase'

interface NotificationCardProps {
  notification: Notification
  index: number
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  index,
}) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        // handle onPress
      }}
    >
      <View style={styles.card}>
        <Feather style={styles.cardImg} color='#636a73' name='info' size={50} />

        {/* <Image
          alt=''
          resizeMode='cover'
          style={styles.cardImg}
          source={{
            uri: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2404&q=80',
          }}
        /> */}

        <View>
          <Text style={styles.cardTitle}>{notification.content}</Text>

          <View style={styles.cardStats}>
            <View style={styles.cardStatsItem}>
              <Feather color='#636a73' name='clock' />

              <Text style={styles.cardStatsItemText}>
                <TimeAgo date={new Date(notification.created_at)} />
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.cardAction}>
          <Feather color='#9ca3af' name='chevron-right' size={22} />
        </View> */}
      </View>
    </TouchableOpacity>
  )
}

export default NotificationCard

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
    width: 270,
  },
  cardStats: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStatsItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  cardStatsItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#636a73',
    marginLeft: 2,
  },
  cardAction: {
    marginLeft: 'auto',
  },
})
