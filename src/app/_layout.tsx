/* eslint-disable max-len */
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import FlashMessage from 'react-native-flash-message'
import * as Sentry from 'sentry-expo'

import { AuthProvider, useAuth } from '../../providers/AuthProvider'

Sentry.init({
  dsn: 'https://d2a3576f505b4af917a8d7fd11cd4c16@o4506394452033536.ingest.sentry.io/4506394488209408',
  enableInExpoDevelopment: false,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

const InitialLayout = (): JSX.Element => {
  const { session, initialized } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (
      (session ?? !initialized) ||
      segments.length === 0 ||
      segments[0] === 'login'
    ) {
      return
    }

    if (!session) {
      router.replace('/')
    }
  }, [session, initialized])

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='(tabs)'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='login'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='onboarding'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='signup'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='[missing]'
        options={{
          title: '404',
        }}
      />
    </Stack>
  )
}

const RootLayout = (): JSX.Element => {
  return (
    <AuthProvider>
      <BottomSheetModalProvider>
        <InitialLayout />
      </BottomSheetModalProvider>
      <FlashMessage position='top' />
    </AuthProvider>
  )
}

export default RootLayout
