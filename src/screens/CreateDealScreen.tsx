import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'

import getDealNatures from '../actions/getDealNatures'
import getOutletsByDealer from '../actions/getOutletsByDealer'
import getSpecialOffers from '../actions/getSpecialOffers'
import { type SelectOption } from '../components/core'
import AddDeal from '../components/forms/AddDeal'
import LoadingIndicator from '../components/LoadingIndicator'
import { useCategoryStore } from '../store/categoryStore'
import { handleError } from '../utils/common'

const CreateDealScreen = (): JSX.Element => {
  const categories = useCategoryStore((state) => state.categories)

  const [loading, setLoading] = useState(true)
  const [dealNatures, setDealNatures] = useState<SelectOption[]>([])
  const [outlets, setOutlets] = useState<SelectOption[]>([])
  const [specialOffers, setSpecialOffers] = useState<SelectOption[]>([])

  const fetchData = async (): Promise<void> => {
    setLoading(true)

    try {
      const [dealNatureResults, outletResults, specialOfferResults] =
        await Promise.all([
          getDealNatures(),
          getOutletsByDealer(),
          getSpecialOffers(),
        ])

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
      handleError(error, 'Error fetching deal data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

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
            <AddDeal
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

export default CreateDealScreen
