/* eslint-disable max-len */
import { Feather } from '@expo/vector-icons'
import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import * as Location from 'expo-location'
import { type LocationGeocodedAddress } from 'expo-location'
import { Link, useFocusEffect, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ContentLoader, { Facebook, Instagram } from 'react-content-loader/native'
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import * as Sentry from 'sentry-expo'

import { supabase } from '../../lib/supabase'
import { useAuth } from '../../providers/AuthProvider'
import getCategories from '../actions/getCategories'
import getDeals from '../actions/getDeals'
import getDealsByCategory from '../actions/getDealsByCategory'
import getPopularDeals from '../actions/getPopularDeals'
import getUser from '../actions/getUser'
import BottomSheet from '../components/BottomSheet'
import CategorySlider from '../components/CategorySlider'
import DealList from '../components/DealList'
import FeaturedDealRow from '../components/FeaturedDealRow'
import LoadingIndicator from '../components/LoadingIndicator'
import { useCategoryStore } from '../store/categoryStore'
import { useLocationStore } from '../store/locationStore'
import { type Deal } from '../types/supabase'
import { handleError } from '../utils/common'
import { DEFAULT_LAT_LNG } from '../utils/constants'

const InstagramLoader = (): JSX.Element => (
  <Instagram
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    // backgroundColor={'#333'}
    // foregroundColor={'#999'}
    viewBox='0 0 400 460'
    speed={1}
  />
)

const HomeScreen = (): JSX.Element => {
  const router = useRouter()
  const { user } = useAuth()
  const locationCoordinates = useLocationStore(
    (state) => state.locationCoordinates
  )
  const updateLocation = useLocationStore((state) => state.updateLocation)
  const updateUserLocation = useLocationStore(
    (state) => state.updateUserLocation
  )

  const categories = useCategoryStore((state) => state.categories)
  const updateCategories = useCategoryStore((state) => state.updateCategories)

  const [location, setLocation] = useState<LocationGeocodedAddress | null>(null)

  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined
  )
  const [allDealsBySection, setAllDealsBySection] = useState<
    string | undefined
  >(undefined)
  const [sectionTitle, setSectionTitle] = useState<string | undefined>(
    undefined
  )
  const [latestDeals, setLatestDeals] = useState<Deal[]>([])
  const [popularDeals, setPopularDeals] = useState<Deal[]>([])
  const [categoryDeals, setCategoryDeals] = useState<Deal[]>([])
  const [sectionDeals, setSectionDeals] = useState<Deal[]>([])

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const userId = useMemo(() => user?.id, [user])

  useEffect(() => {
    void (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.log('Permission to access location was denied')
          return
        }
        const defaultLocation = {
          latitude: 0,
          longitude: 0,
        }

        const currentUser = await getUser()

        if (currentUser?.latitude && currentUser?.longitude) {
          defaultLocation.latitude = currentUser.latitude
          defaultLocation.longitude = currentUser.longitude

          updateUserLocation(defaultLocation)
        } else {
          const currentLocation = await Location.getCurrentPositionAsync({})

          defaultLocation.latitude = currentLocation.coords.latitude
          defaultLocation.longitude = currentLocation.coords.longitude

          if (userId) {
            const { error } = await supabase
              .from('users')
              .update({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              })
              .eq('id', userId)

            if (error) {
              Alert.alert(error.message)
            }
          }
        }

        updateLocation(defaultLocation)

        const currentAddress =
          await Location.reverseGeocodeAsync(defaultLocation)
        if (currentAddress.length > 0) {
          setLocation(currentAddress[0])
        }
      } catch (error) {
        handleError(error, 'Error fetching location', {
          tags: {
            section: 'expo - updateLocation',
          },
        })
      }
    })()
  }, [updateLocation, userId])

  useEffect(() => {
    if (locationCoordinates) {
      void (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync()
          if (status !== 'granted') {
            console.log('Permission to access location was denied')
            return
          }

          const currentAddress = await Location.reverseGeocodeAsync({
            latitude: locationCoordinates.latitude,
            longitude: locationCoordinates.longitude,
          })
          if (currentAddress.length > 0) {
            setLocation(currentAddress[0])
          }
        } catch (error) {
          handleError(error, 'Geocode: Error getting location', {
            tags: {
              section: 'expo - reverseGeocodeAsync',
            },
          })
        }
      })()
    }
  }, [locationCoordinates])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setActiveCategory(undefined)
    setCategoryDeals([])

    setSectionDeals([])
    setSectionTitle(undefined)
    setSearchValue('')
    setAllDealsBySection(undefined)

    try {
      const [categoryResults, dealResults, popularDealResults] =
        await Promise.all([getCategories(), getDeals(), getPopularDeals()])

      if (categoryResults.length > 0) {
        // setCategories(categoryResults)
        updateCategories(categoryResults)
      }
      if (dealResults.length > 0) {
        setLatestDeals(dealResults)
      }
      if (popularDealResults.length > 0) {
        setPopularDeals(popularDealResults)
      }
    } catch (error) {
      handleError(error, 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void fetchData()
      return () => {}
    }, [fetchData])
  )

  const handleChangeCategory = (category: string): void => {
    setSearchValue('')
    setLoading(true)
    setActiveCategory(category)
    setAllDealsBySection(undefined)

    void (async () => {
      try {
        const deals = await getDealsByCategory({ title: category })
        setCategoryDeals(deals)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        handleError(error, 'Error fetching deals')
      }
    })() // Immediately Invoked Function Expression (IIFE)
  }

  const handleViewAllDealsBySection = (section: string): void => {
    if (!section) return

    setLoading(true)
    setActiveCategory(undefined)
    setSectionDeals([])
    setSectionTitle(undefined)

    void (async () => {
      try {
        if (section === 'popular') {
          const deals = await getPopularDeals()
          setSectionDeals(deals)
          setSectionTitle('Popular Deals')
        }
        if (section === 'latest') {
          const deals = await getDeals()
          setSectionDeals(deals)
          setSectionTitle('Latest Deals')
        }

        setAllDealsBySection(section)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        handleError(error, 'Error fetching deals')
      }
    })() // Immediately Invoked Function Expression (IIFE)
  }

  return (
    <SafeAreaView className='flex-1 top-14'>
      <BottomSheet ref={bottomSheetRef} />
      <StatusBar style='dark' />
      <View className='flex-row items-center space-x-2 px-4 pb-2 '>
        <View className='flex-row flex-1 items-center p-3 rounded-full border border-gray-300'>
          <Feather name='search' size={25} color='gray' />
          <Pressable
            className='ml-2 flex-1'
            onPress={() => {
              router.replace('/home/search')
            }}
          >
            <View pointerEvents='none'>
              <TextInput
                placeholder='Search for deals...'
                keyboardType='default'
                value={searchValue}
                onChangeText={setSearchValue}
              />
            </View>
          </Pressable>

          {location?.city && (
            <Link
              href={{
                pathname: '/(tabs)/home/location-search',
                params: {
                  latitude: locationCoordinates
                    ? locationCoordinates.latitude
                    : DEFAULT_LAT_LNG[0],
                  longitude: locationCoordinates
                    ? locationCoordinates.longitude
                    : DEFAULT_LAT_LNG[1],
                },
              }}
              asChild
            >
              <TouchableOpacity
                className='flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300'
                // onPress={openModal}
              >
                <Feather name='map-pin' size={20} color='gray' />
                <Text className='text-gray-600'>{location.city}</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
        <View
          style={{ backgroundColor: 'rgba(30, 41, 59, 1)' }}
          className='p-3 rounded-full'
        >
          <Feather
            name='sliders'
            size={20}
            color='white'
            strokeWidth='2.5'
            onPress={() => {
              router.replace('/home/search')
            }}
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className='space-y-6 pt-3'
      >
        <View className='pb-4'>
          {categories.length > 0 && (
            <CategorySlider
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        {activeCategory === undefined && allDealsBySection === undefined && (
          <>
            <View>
              <FeaturedDealRow
                title='Popular Deals'
                description='Browse the catchiest deals'
                deals={popularDeals}
                tag='popular'
                onViewAll={() => {
                  handleViewAllDealsBySection('popular')
                }}
              />
            </View>
            <View>
              <FeaturedDealRow
                title='Latest Deals'
                description='Fresh deals for you'
                deals={latestDeals}
                tag='latest'
                onViewAll={() => {
                  handleViewAllDealsBySection('latest')
                }}
              />
            </View>
          </>
        )}

        {activeCategory && (
          <View>
            {loading ? (
              <LoadingIndicator size='large' className='mt-16' />
            ) : (
              <DealList
                title={activeCategory}
                deals={categoryDeals}
                dealPathPrefix='/home'
                tag='category'
              />
            )}
          </View>
        )}

        {allDealsBySection && (
          <View>
            {loading ? (
              <LoadingIndicator size='large' className='mt-16' />
            ) : (
              <DealList
                title={sectionTitle ?? ''}
                deals={sectionDeals}
                dealPathPrefix='/home'
                tag='all'
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen
