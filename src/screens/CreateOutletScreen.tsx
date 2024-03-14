import React from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'

import AddOutlet from '../components/forms/AddOutlet'

const CreateOutletScreen = (): JSX.Element => {
  return (
    <SafeAreaView className='flex-1 top-14'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className='space-y-6 pt-3'
      >
        <View>
          <AddOutlet />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateOutletScreen
