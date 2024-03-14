import { Image } from 'expo-image'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { type Category } from '../types/supabase'
import { BLUR_HASH } from '../utils/constants'

interface CategorySliderProps {
  categories: Category[]
  activeCategory: string | undefined
  handleChangeCategory: (category: string) => void
}

const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  activeCategory,
  handleChangeCategory,
}) => {
  return (
    // <Animated.View entering={FadeInDown.duration(500).springify()}>
    // </Animated.View>
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='space-x-4'
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {categories.map((cat, index) => {
          const isActive = cat.title === activeCategory
          const activeButtonClass = isActive ? ' bg-amber-400' : ' bg-black/10'
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => {
                handleChangeCategory(cat.title)
              }}
              className='flex items-center space-y-1'
            >
              <View className={'rounded-full p-[6px] ' + activeButtonClass}>
                <Image
                  className='rounded-full'
                  style={{ width: hp(6), height: hp(6) }}
                  source={cat.image_url}
                  placeholder={BLUR_HASH}
                  contentFit='cover'
                  transition={1000}
                />
              </View>
              <Text className='text-neutral-600' style={{ fontSize: hp(1.6) }}>
                {cat.title}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default CategorySlider
