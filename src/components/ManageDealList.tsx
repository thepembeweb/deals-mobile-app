/* eslint-disable max-len */
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useNavigation } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { type Deal } from '../types/supabase'
import EmptyList from './EmptyList'
import LoadingIndicator from './LoadingIndicator'
import ManageDealCard from './ManageDealCard'

interface ManageDealListProps {
  title: string
  deals: Deal[]
  emptyListMessage?: string
}

const ManageDealList: React.FC<ManageDealListProps> = ({
  title,
  deals,
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
        {deals.length === 0 ? (
          <LoadingIndicator size='large' className='mt-20' />
        ) : (
          <View style={{ flexGrow: 1, flexDirection: 'row', minHeight: 2 }}>
            <FlashList
              data={deals}
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
                  <ManageDealCard key={item.id} deal={item} index={index} />
                )
              }}
            />
          </View>
        )}
      </View>

      {/* <Text
        style={{ fontSize: hp(3) }}
        className='font-semibold text-neutral-600'
      >
        {title}

        {lessons.map(({ name, cal, duration, img }, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                // handle onPress
              }}
            >
              <View style={styles.card}>
                <Image
                  alt=''
                  resizeMode='cover'
                  style={styles.cardImg}
                  source={{ uri: img }}
                />

                <View>
                  <Text style={styles.cardTitle}>{name}</Text>

                  <View style={styles.cardStats}>
                    <View style={styles.cardStatsItem}>
                      <Feather color='#636a73' name='clock' />

                      <Text style={styles.cardStatsItemText}>
                        {duration} mins
                      </Text>
                    </View>

                    <View style={styles.cardStatsItem}>
                      <Feather color='#636a73' name='zap' />

                      <Text style={styles.cardStatsItemText}>{cal} cals</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardAction}>
                  <Feather color='#9ca3af' name='chevron-right' size={22} />
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </Text> */}
    </View>
  )
}

export default ManageDealList
