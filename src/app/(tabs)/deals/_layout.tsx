import { Stack } from 'expo-router'
import React from 'react'

export default function _layout(): JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Deals',
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
