import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'

import getOutletsByDealer from '../actions/getOutletsByDealer'
import LoadingIndicator from '../components/LoadingIndicator'
import ManageOutletList from '../components/ManageOutletList'
import { type Outlet } from '../types/supabase'
import { handleError } from '../utils/common'

const OutletsScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [outlets, setOutlets] = useState<Outlet[]>([])

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const currentOutlets = await getOutletsByDealer()
      if (currentOutlets.length > 0) {
        setOutlets(currentOutlets)
      }
      setLoading(false)
    } catch (error) {
      handleError(error, 'Error fetching outlets')
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
            <ManageOutletList
              title='Outlets'
              outlets={outlets}
              emptyListMessage='No outlets ... yet!'
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default OutletsScreen
