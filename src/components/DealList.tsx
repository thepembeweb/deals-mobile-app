import MasonryList from '@react-native-seoul/masonry-list'
import React from 'react'
import { Text, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { type Deal } from '../types/supabase'
import DealCard from './DealCard'
import EmptyList from './EmptyList'

interface DealListProps {
  title: string
  deals: Deal[]
  dealPathPrefix: '/deals' | '/favorites' | '/home'
  emptyListMessage?: string
  tag?: string
}

const DealList: React.FC<DealListProps> = ({
  title,
  deals,
  dealPathPrefix = '/home',
  emptyListMessage = 'No results found.',
  tag,
}) => {
  return (
    <View className='mx-4 space-y-3 mb-16'>
      <Text
        style={{ fontSize: hp(3) }}
        className='font-semibold text-neutral-600'
      >
        {title}
      </Text>
      <View>
        <MasonryList
          data={
            deals.map((deal) => ({
              ...deal,
              sharedTransitionTag: `${tag}-${deal.id}`,
            })) as Deal[]
          }
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }) => (
            <DealCard
              deal={item as Deal}
              index={i}
              dealPathPrefix={dealPathPrefix}
            />
          )}
          ListEmptyComponent={<EmptyList message={emptyListMessage} />}
          onEndReachedThreshold={0.1}
        />
      </View>
    </View>
  )
}

export default DealList
