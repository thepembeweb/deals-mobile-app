import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'

import getDealsByCategory from '../../../actions/getDealsByCategory'
import { type Deal } from '../../../types/supabase'

const CategoryDeals = (): JSX.Element => {
  const searchParams = useLocalSearchParams()
  const [deals, setDeals] = useState<Deal[]>([])

  useEffect(() => {
    void initDealsByCategory()
  }, [])

  const initDealsByCategory = async (): Promise<void> => {
    try {
      const categoryDeals = await getDealsByCategory(searchParams)
      if (categoryDeals.length > 0) {
        setDeals(categoryDeals)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    }
  }

  return (
    <View>
      <Text>Category</Text>
    </View>
  )
}

export default CategoryDeals
