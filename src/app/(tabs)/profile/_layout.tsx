import { Stack } from 'expo-router'
import React from 'react'

export default function _layout(): JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='messages'
        options={{
          title: 'Messages',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='notifications'
        options={{
          title: 'Notifications',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='manage-deals'
        options={{
          title: 'Manage Deals',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='create-deal'
        options={{
          title: 'Create Deal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='edit-deal'
        options={{
          title: 'Edit Deal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='manage-outlets'
        options={{
          title: 'Manage Outlets',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='create-outlet'
        options={{
          title: 'Create Outlet',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='edit-outlet'
        options={{
          title: 'Edit Outlet',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='edit-profile'
        options={{
          title: 'Edit Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='location-selector'
        options={{
          title: 'LocationSelector',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='filter'
        options={{
          title: 'Filter',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
