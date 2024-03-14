import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'

import getOutletById from '../actions/getOutletById'
import EditOutlet from '../components/forms/EditOutlet'
import ItemNotFound from '../components/ItemNotFound'
import LoadingIndicator from '../components/LoadingIndicator'
import { type Outlet } from '../types/supabase'
import { handleError } from '../utils/common'

const EditOutletScreen = (): JSX.Element => {
  const params = useLocalSearchParams()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [outlet, setOutlet] = useState<Outlet | null>(null)

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const result = await getOutletById(id as string)
      if (result) {
        setOutlet(result)
      }
      setLoading(false)
    } catch (error) {
      handleError(error, 'Error fetching outlet')
    } finally {
      setLoading(false)
    }
  }, [id])

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
        {loading && <LoadingIndicator size='large' className='mt-16' />}
        {!loading && !outlet && <ItemNotFound message='Outlet not found.' />}
        {outlet && (
          <View>
            <EditOutlet outlet={outlet} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditOutletScreen
