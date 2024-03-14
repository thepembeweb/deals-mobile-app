import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'

import getDealsByDealer from '../actions/getDealsByDealer'
import LoadingIndicator from '../components/LoadingIndicator'
import ManageDealList from '../components/ManageDealList'
import { type Deal } from '../types/supabase'
import { handleError } from '../utils/common'

const DealsScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<Deal[]>([])

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const currentDeals = await getDealsByDealer()
      if (currentDeals.length > 0) {
        setDeals(currentDeals)
      }
      setLoading(false)
    } catch (error) {
      handleError(error, 'Error fetching deals')
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
            <ManageDealList
              title='Deals'
              deals={deals}
              emptyListMessage='No deals ... yet!'
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default DealsScreen
