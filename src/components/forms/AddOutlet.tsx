import { Feather, Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { type LocationGeocodedAddress } from 'expo-location'
import { Link, useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import uuid from 'react-native-uuid'
import { z } from 'zod'

import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../providers/AuthProvider'
import { Button, ControlledInput } from '../../components/core'
import { useLocationStore } from '../../store/locationStore'
import colors from '../../theme/colors'
import {
  getAddressDescription,
  handleError,
  showErrorMessage,
} from '../../utils/common'
import {
  BLUR_HASH,
  DEFAULT_LAT_LNG,
  IMAGES_OUTLETS_BUCKET,
} from '../../utils/constants'

const schema = z.object({
  title: z.string().min(1).max(20),
  description: z.string().min(1).max(255),
  manager_first_name: z.string().min(1).max(255),
  manager_last_name: z.string().min(1).max(255),
  manager_title: z.string().min(1).max(20),
  address: z.string().min(1).max(255),
  mobile_number: z.string().min(1).max(20),
  landline_number: z
    .string()
    .min(4, 'Please enter a valid value')
    .optional()
    .or(z.literal('')),
})

type FormType = z.infer<typeof schema>

const AddOutlet = (): JSX.Element => {
  const { user } = useAuth()
  const router = useRouter()
  const navigation = useNavigation()
  const locationCoordinates = useLocationStore(
    (state) => state.locationCoordinates
  )
  const selectorLocationCoordinates = useLocationStore(
    (state) => state.selectorLocationCoordinates
  )
  const updateSelectorLocation = useLocationStore(
    (state) => state.updateSelectorLocation
  )

  const [location, setLocation] = useState<LocationGeocodedAddress | null>(null)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [outletImage, setOutletImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
  })
  // const { mutate: addPost, isLoading } = useAddPost()

  const onSubmit = async (data: FormType): Promise<void> => {
    try {
      if (!user) {
        router.push('/login')
        return
      }

      if (selectorLocationCoordinates === null || location === null) {
        showErrorMessage('Please select Outlet Location')
        return
      }
      if (outletImage === null) {
        showErrorMessage('Please select Outlet Image')
        return
      }

      setIsLoading(true)
      const { data: outletData, error: updateProviderError } = await supabase
        .from('outlets')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          manager_first_name: data.manager_first_name,
          manager_last_name: data.manager_last_name,
          manager_title: data.manager_title,
          address: data.address,
          mobile_number: data.mobile_number,
          landline_number: data.landline_number,
          latitude: selectorLocationCoordinates.latitude,
          longitude: selectorLocationCoordinates.longitude,
          place: getAddressDescription(location),
          place_code: null,
        })
        .select()

      if (updateProviderError) {
        showErrorMessage(updateProviderError.message)
        setIsLoading(false)
        return
      }

      const outletId = outletData[0].id

      // Upload outlet images
      const savedImagePaths = []
      for (const imageFile of [outletImage]) {
        const uniqueID = uuid.v4() as string

        const base64 = await FileSystem.readAsStringAsync(imageFile.uri, {
          encoding: 'base64',
        })
        const filePath = `image-${outletId}-${uniqueID}`
        const contentType =
          imageFile.type === 'image' ? 'image/png' : 'video/mp4'

        const { data: imageData, error: imageError } = await supabase.storage
          .from(IMAGES_OUTLETS_BUCKET)
          .upload(filePath, decode(base64), {
            contentType,
            cacheControl: '3600',
            upsert: false,
          })

        if (imageError) {
          setIsLoading(false)
          showErrorMessage('Failed image upload')
          setIsLoading(false)
          return
        }

        savedImagePaths.push(imageData.path)

        // Create deal_images records
        for (const [index, path] of savedImagePaths.entries()) {
          const { error: insertOutletImageError } = await supabase
            .from('outlet_images')
            .insert({
              image_url: path,
              outlet_id: outletId,
              sort_order: index + 1,
            })

          if (insertOutletImageError) {
            showErrorMessage(insertOutletImageError.message)
            setIsLoading(false)
            return
          }
        }

        const { data: provider, error: selectProviderError } = await supabase
          .from('providers')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (selectProviderError) {
          showErrorMessage(selectProviderError.message)
          setIsLoading(false)
          return
        }
        // Create deal_outlets records
        const { error: insertProviderOutletError } = await supabase
          .from('provider_outlets')
          .insert({
            outlet_id: outletId,
            provider_id: provider.id,
          })

        if (insertProviderOutletError) {
          showErrorMessage(insertProviderOutletError.message)
          setIsLoading(false)
          return
        }

        showMessage({
          message: 'Outlet created!',
          type: 'success',
        })

        reset()
        updateSelectorLocation(null)
        setOutletImage(null)
        setImageUri(null)
        setLocation(null)

        navigation.goBack()
      }

      // addPost(
      //   { ...data, userId: 1 },
      //   {
      //     onSuccess: () => {
      //       showMessage({
      //         message: 'Post added successfully',
      //         type: 'success',
      //       })
      //       // here you can navigate to the post list and refresh the list data
      //       //queryClient.invalidateQueries(usePosts.getKey());
      //     },
      //     onError: () => {
      //       showErrorMessage('Error adding post')
      //     },
      //   }
      // )
    } catch (error) {
      handleError(error, 'Error creating outlet')
    } finally {
      setIsLoading(false)
    }
  }

  const onSelectImage = async (): Promise<void> => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      // allowsMultipleSelection: true,
      // selectionLimit: 4,
    }

    const result = await ImagePicker.launchImageLibraryAsync(options)

    // Save image if not cancelled
    if (!result.canceled) {
      const img = result.assets[0]
      setImageUri(img.uri)
      setOutletImage(img)

      // const base64 = await FileSystem.readAsStringAsync(img.uri, {
      //   encoding: 'base64',
      // })
      // const filePath = `${user!.id}/${new Date().getTime()}.${
      //   img.type === 'image' ? 'png' : 'mp4'
      // }`
      // const contentType = img.type === 'image' ? 'image/png' : 'video/mp4'

      // await supabase.storage
      //   .from('files')
      //   .upload(filePath, decode(base64), { contentType })
    }
  }

  useEffect(() => {
    const fetchAndUpdateLocation = async (): Promise<void> => {
      if (selectorLocationCoordinates) {
        try {
          const addresses = await Location.reverseGeocodeAsync(
            selectorLocationCoordinates
          )

          if (addresses.length > 0) {
            setLocation(addresses[0])
          }
        } catch (error) {
          handleError(error, 'Error fetching location')
        }
      }
    }

    void fetchAndUpdateLocation()
  }, [selectorLocationCoordinates])

  return (
    <View className='flex-1 p-4 '>
      <View className='flex-row'>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className='flex-row items-center justify-center mr-2'
        >
          <Feather color='#000' name='arrow-left' size={18} />
        </TouchableOpacity>

        <Text
          style={{ fontSize: hp(3) }}
          className='font-semibold text-neutral-600'
        >
          {'Add Outlet'}
        </Text>
      </View>
      <View className='flex-1 p-4 '>
        <ControlledInput
          name='title'
          label='Outlet Title'
          control={control}
          testID='title'
        />
        <ControlledInput
          name='description'
          label='About the Outlet'
          control={control}
          multiline
          testID='description-input'
        />
        <ControlledInput
          name='address'
          label='Address'
          control={control}
          multiline
          testID='address'
        />
        <ControlledInput
          name='manager_first_name'
          label='Manager First name'
          control={control}
          testID='manager_first_name'
        />
        <ControlledInput
          name='manager_last_name'
          label='Manager Last name'
          control={control}
          testID='manager_last_name'
        />
        <ControlledInput
          name='manager_title'
          label='Manager Title'
          control={control}
          testID='manager_title'
        />
        <ControlledInput
          name='mobile_number'
          label='Mobile Number'
          control={control}
          testID='mobile_number'
        />
        <ControlledInput
          name='landline_number'
          label='Landline Number'
          control={control}
          testID='landline_number'
        />
        <Link
          href={{
            pathname: '/(tabs)/profile/location-selector',
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
          <TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: 16,
                borderColor: colors.grey,
                borderWidth: 1,
              }}
              className={'mt-0 py-4 px-2 mb-4'}
            >
              <Ionicons
                name='location-outline'
                size={20}
                color={colors.medium}
              />
              <Text style={{ flex: 1 }}>
                {location
                  ? getAddressDescription(location)
                  : 'Select Outlet Location'}
              </Text>
              <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
            </View>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          onPress={() => {
            void onSelectImage()
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: 16,
              borderColor: colors.grey,
              borderWidth: 1,
            }}
            className={'mt-0 py-4 px-2'}
          >
            <Ionicons name='image' size={20} color={colors.medium} />

            {imageUri ? (
              <Image
                // className='h-36 w-full rounded-t-2xl mx-auto'
                // style={{ aspectRatio: 1, resizeMode: 'cover' }}
                style={[styles.avatar, styles.image]}
                source={{ uri: imageUri }}
                placeholder={BLUR_HASH}
                contentFit='cover'
                transition={1000}
              />
            ) : (
              <View style={[styles.avatar, styles.noImage]} />
            )}
            <Text style={{ flex: 1 }}>
              {imageUri ? 'Outlet Image' : 'Select Outlet Image'}
            </Text>
            <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
          </View>
        </TouchableOpacity>

        <Button
          label='Add Outlet'
          loading={isLoading}
          onPress={() => {
            void handleSubmit(onSubmit)()
          }}
          testID='add-post-button'
        />
      </View>
    </View>
  )
}

export default AddOutlet

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
    aspectRatio: 1,
    resizeMode: 'cover',
    height: 150,
    width: 150,
  },
  noImage: {
    backgroundColor: '#333',
    border: '1px solid rgb(200, 200, 200)',
    borderRadius: 5,
    height: 150,
    width: 150,
  },
})
