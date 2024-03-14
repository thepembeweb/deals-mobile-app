import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { type Deal } from '../types/supabase'
import DealRowCard from './DealRowCard'

interface FeaturedCardRowProps {
  title: string
  description: string
  deals: Deal[]
  tag?: string
  onViewAll?: () => void
  // navigation: NavigationProp<RootStackParamList>;
}

const FeaturedCardRow: React.FC<FeaturedCardRowProps> = ({
  title,
  description,
  deals,
  tag,
  onViewAll,
  // navigation,
}) => {
  return (
    <View>
      <View className='flex-row justify-between items-center px-4'>
        <View>
          <Text
            style={{ fontSize: hp(2.5) }}
            className='font-semibold text-neutral-600'
          >
            {title}
          </Text>
          <Text style={{ fontSize: hp(1.7) }} className='text-gray-500'>
            {description}
          </Text>
        </View>

        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={{ color: 'red' }} className='font-semibold'>
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        className='overflow-visible py-5'
      >
        {deals
          .map((deal) => ({
            ...deal,
            sharedTransitionTag: `${tag}-${deal.id}`,
          }))
          .map((deal) => {
            return <DealRowCard key={deal.id} deal={deal} />
          })}
      </ScrollView>
    </View>
  )
}

export default FeaturedCardRow
