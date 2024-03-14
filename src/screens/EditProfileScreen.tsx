import React from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'

import EditProfile from '../components/forms/EditProfile'

const EditProfileScreen = (): JSX.Element => {
  return (
    <SafeAreaView className='flex-1 top-14'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className='space-y-6 pt-3'
      >
        <View>
          <EditProfile />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfileScreen
