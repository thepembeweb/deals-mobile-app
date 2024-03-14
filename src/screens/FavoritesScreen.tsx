import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'

import getFavoriteDealsByUser from '../actions/getFavoriteDealsByUser'
import DealList from '../components/DealList'
import LoadingIndicator from '../components/LoadingIndicator'
import { type Deal } from '../types/supabase'
import { handleError } from '../utils/common'

const FavoritesScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<Deal[]>([])

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const favoriteDeals = await getFavoriteDealsByUser()
      if (favoriteDeals.length > 0) {
        setDeals(favoriteDeals)
      }
      setLoading(false)
    } catch (error) {
      handleError(error, 'Error fetching favorite deals')
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
            <DealList
              title='Favorites'
              deals={deals}
              tag='favorites'
              dealPathPrefix='/favorites'
              emptyListMessage='No favorite deals ... yet!'
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default FavoritesScreen
