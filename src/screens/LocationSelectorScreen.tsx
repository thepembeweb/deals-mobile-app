/* eslint-disable max-len */
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import { useLocationStore } from '../store/locationStore'
import colors from '../theme/colors'
import { DEFAULT_LAT_LNG } from '../utils/constants'

const LocationSelectorScreen = (): JSX.Element => {
  const params = useLocalSearchParams()
  const { latitude, longitude } = params
  const navigation = useNavigation()
  const updateSelectorLocation = useLocationStore(
    (state) => state.updateSelectorLocation
  )
  const [location, setLocation] = useState({
    latitude: latitude ? Number(latitude) : DEFAULT_LAT_LNG[0],
    longitude: longitude ? Number(longitude) : DEFAULT_LAT_LNG[1],
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  })

  return (
    <SafeAreaView className='flex-1 top-14'>
      <GooglePlacesAutocomplete
        placeholder='Search for location'
        fetchDetails={true}
        debounce={200}
        onPress={(data, details) => {
          const point = details?.geometry?.location
          if (!point) return

          setLocation({
            ...location,
            latitude: point.lat,
            longitude: point.lng,
          })
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: 'en',
        }}
        renderLeftButton={() => (
          <View style={styles.boxIcon}>
            <Ionicons name='search-outline' size={24} color={colors.medium} />
          </View>
        )}
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            backgroundColor: colors.grey,
            paddingLeft: 35,
            borderRadius: 10,
          },
          textInputContainer: {
            padding: 8,
            backgroundColor: '#fff',
          },
        }}
      />
      <MapView
        showsUserLocation={true}
        style={styles.map}
        region={location}
        provider={PROVIDER_GOOGLE}
      />
      <View style={styles.absoluteBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            updateSelectorLocation({
              latitude: location.latitude,
              longitude: location.longitude,
            })
            navigation.goBack()
          }}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#20E1B2',
    padding: 16,
    margin: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  boxIcon: {
    position: 'absolute',
    left: 15,
    top: 18,
    zIndex: 1,
  },
})

export default LocationSelectorScreen
