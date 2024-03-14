import * as Location from 'expo-location'
import { useEffect, useMemo } from 'react'
import { Alert } from 'react-native'

import { supabase } from '../../lib/supabase'
import { useAuth } from '../../providers/AuthProvider'
import getUser from '../actions/getUser'
import { useLocationStore } from '../store/locationStore'

// type User = {
//   id: string
//   latitude?: number
//   longitude?: number
// }

// type LocationType = {
//   latitude: number
//   longitude: number
// }

const useUserLocation2 = (): void => {
  const { user } = useAuth()
  const updateLocation = useLocationStore((state) => state.updateLocation)
  const updateUserLocation = useLocationStore(
    (state) => state.updateUserLocation
  )
  const userId = useMemo(() => user?.id, [user])

  const fetchAndUpdateLocation = async (): Promise<void> => {
    const defaultLocation = {
      latitude: 0,
      longitude: 0,
    }

    const currentUser = await getUser()

    if (currentUser?.latitude && currentUser?.longitude) {
      Object.assign(defaultLocation, currentUser)
      updateUserLocation(defaultLocation)
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({})
      Object.assign(defaultLocation, currentLocation.coords)

      if (userId) {
        const { error } = await supabase
          .from('users')
          .update(defaultLocation)
          .eq('id', userId)

        if (error) {
          Alert.alert(error.message)
        }
      }
    }

    updateLocation(defaultLocation)

    const currentAddress = await Location.reverseGeocodeAsync(defaultLocation)
    if (currentAddress.length > 0) {
      setLocation(currentAddress[0])
    }
  }

  useEffect(() => {
    void fetchAndUpdateLocation()
  }, [userId])
}

export default useUserLocation2
