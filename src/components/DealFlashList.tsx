import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { Text, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { type Deal } from '../types/supabase'
import DealCard from './DealCard'
import EmptyList from './EmptyList'
import LoadingIndicator from './LoadingIndicator'

interface DealFlashListProps {
  title: string
  deals: Deal[]
  tag?: string
}

const DealFlashList: React.FC<DealFlashListProps> = ({ title, deals, tag }) => {
  return (
    <View className='mx-4 space-y-3'>
      <Text
        style={{ fontSize: hp(3) }}
        className='font-semibold text-neutral-600'
      >
        {title}
      </Text>
      <View>
        {deals.length === 0 ? (
          <LoadingIndicator size='large' className='mt-20' />
        ) : (
          <View>
            <FlashList
              data={
                deals.map((deal) => ({
                  ...deal,
                  sharedTransitionTag: `${tag}-${deal.id}`,
                })) as Deal[]
              }
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
              renderItem={({ item, index }) => {
                return (
                  <DealCard
                    key={item.id}
                    deal={item}
                    index={index}
                    dealPathPrefix='/home'
                  />
                )
              }}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default DealFlashList
