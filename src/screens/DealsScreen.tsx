import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'

import getBookedDealsByUser from '../actions/getBookedDealsByUser'
import DealList from '../components/DealList'
import LoadingIndicator from '../components/LoadingIndicator'
import { type Deal } from '../types/supabase'
import { handleError } from '../utils/common'

const DealsScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<Deal[]>([])

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const bookedDeals = await getBookedDealsByUser()
      if (bookedDeals.length > 0) {
        setDeals(bookedDeals)
      }
      setLoading(false)
    } catch (error) {
      handleError(error, 'Error fetching booked deals')
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
              title='Deals'
              deals={deals}
              tag='deals'
              dealPathPrefix='/deals'
              emptyListMessage='No deals booked ... yet!'
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default DealsScreen
