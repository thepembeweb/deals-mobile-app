import { Stack } from 'expo-router'
import React from 'react'

export default function _layout(): JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='search'
        options={{
          title: 'Search',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='location-search'
        options={{
          title: 'LocationSearch',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
