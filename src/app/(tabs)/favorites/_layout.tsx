import { Stack } from 'expo-router'
import React from 'react'

export default function _layout(): JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Favorites',
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
    </Stack>
  )
}
