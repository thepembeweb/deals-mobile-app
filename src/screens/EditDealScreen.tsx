import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'

import getDealById from '../actions/getDealById'
import getDealNatures from '../actions/getDealNatures'
import getOutletsByDealer from '../actions/getOutletsByDealer'
import getSpecialOffers from '../actions/getSpecialOffers'
import { type SelectOption } from '../components/core'
import EditDeal from '../components/forms/EditDeal'
import ItemNotFound from '../components/ItemNotFound'
import LoadingIndicator from '../components/LoadingIndicator'
import { useCategoryStore } from '../store/categoryStore'
import { type Deal } from '../types/supabase'
import { handleError } from '../utils/common'

const EditDealScreen = (): JSX.Element => {
  const params = useLocalSearchParams()
  const { id } = params

  const categories = useCategoryStore((state) => state.categories)

  const [loading, setLoading] = useState(true)
  const [dealNatures, setDealNatures] = useState<SelectOption[]>([])
  const [outlets, setOutlets] = useState<SelectOption[]>([])
  const [specialOffers, setSpecialOffers] = useState<SelectOption[]>([])
  const [deal, setDeal] = useState<Deal | null>(null)

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const [
        dealResult,
        dealNatureResults,
        outletResults,
        specialOfferResults,
      ] = await Promise.all([
        getDealById(id as string),
        getDealNatures(),
        getOutletsByDealer(),
        getSpecialOffers(),
      ])

      if (dealResult) {
        setDeal(dealResult)
      }
      if (dealNatureResults.length > 0) {
        setDealNatures(
          dealNatureResults.map((c) => ({ value: c.id, label: c.title }))
        )
      }
      if (outletResults.length > 0) {
        setOutlets(outletResults.map((c) => ({ value: c.id, label: c.title })))
      }
      if (specialOfferResults.length > 0) {
        setSpecialOffers(
          specialOfferResults.map((c) => ({ value: c.id, label: c.title }))
        )
      }
    } catch (error) {
      handleError(error, 'Error fetching deal')
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
        {!loading && !deal && <ItemNotFound message='Deal not found.' />}
        {deal && (
          <View>
            <EditDeal
              deal={deal}
              categories={categories.map((c) => ({
                value: c.id,
                label: c.title,
              }))}
              dealNatures={dealNatures}
              outlets={outlets}
              specialOffers={specialOffers}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditDealScreen
