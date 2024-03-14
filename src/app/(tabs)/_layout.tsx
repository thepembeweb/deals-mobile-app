// import { BlurView } from "expo-blur";
import { FontAwesome } from '@expo/vector-icons'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import { Tabs, useSegments } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function _layout(): JSX.Element {
  const segments = useSegments()
  const segmentsArray = Array.from(segments)
  const tabBarHiddenRoutes = [
    '[id]',
    'search',
    'location-search',
    'location-selector',
  ]
  const isTabBarHidden = tabBarHiddenRoutes.some((route) =>
    segmentsArray.includes(route)
  )

  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarStyle: {
          display: isTabBarHidden ? 'none' : 'flex',
        },
        headerShown: false,
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen
        name='home'
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 17,
                backgroundColor: 'transparent',
              }}
            >
              <TabBarIcon name='home' color={color} size={24} />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                Home
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='favorites'
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 17,
                backgroundColor: 'transparent',
              }}
            >
              <TabBarIcon name='heart-o' color={color} size={24} />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                Favorites
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='deals'
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 17,
                backgroundColor: 'transparent',
              }}
            >
              <TabBarIcon name='shopping-bag' color={color} size={24} />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                Deals
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 17,
                backgroundColor: 'transparent',
              }}
            >
              <TabBarIcon name='user' color={color} size={24} />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>
                Profile
              </Text>
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  )
}

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
  size?: number
}): JSX.Element => {
  return (
    <FontAwesome
      size={props.size ?? 26}
      style={{ marginBottom: -3 }}
      {...props}
    />
  )
}
