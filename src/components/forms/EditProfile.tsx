import { Feather, Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import uuid from 'react-native-uuid'
import { z } from 'zod'

import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../providers/AuthProvider'
import getFileUrls from '../../actions/getFileUrls'
import getUser from '../../actions/getUser'
import { Button, ControlledInput } from '../../components/core'
import colors from '../../theme/colors'
import { type FileUrl } from '../../types/supabase'
import { handleError, showErrorMessage } from '../../utils/common'
import {
  BLUR_HASH,
  IMAGES,
  IMAGES_USERS_BUCKET,
  USERS,
} from '../../utils/constants'

const schema = z.object({
  full_name: z.string().min(1).max(255),
  mobile_number: z.string().min(1).max(20),
})

type FormType = z.infer<typeof schema>

const EditProfile = (): JSX.Element => {
  const { user } = useAuth()
  const router = useRouter()
  const navigation = useNavigation()
  const params = useLocalSearchParams()
  const { avatarUrl } = params

  const [imageUri, setImageUri] = useState<string | null>(null)
  const [userImage, setUserImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const [profileImageFileUrls, setProfileImageFileUrls] = useState<
    FileUrl[] | null
  >([])

  const { control, handleSubmit, reset, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormType): Promise<void> => {
    try {
      if (!user) {
        router.push('/login')
        return
      }

      setIsLoading(true)
      const { error: updateUserError } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
          mobile_number: data.mobile_number,
        })
        .eq('id', user.id)

      if (updateUserError) {
        showErrorMessage(updateUserError.message)
        setIsLoading(false)
        return
      }

      // Upload outlet images
      if (userImage !== null) {
        const savedImagePaths = []
        for (const imageFile of [userImage]) {
          const uniqueID = uuid.v4() as string

          const base64 = await FileSystem.readAsStringAsync(imageFile.uri, {
            encoding: 'base64',
          })
          const filePath = `image-${user.id}-${uniqueID}`
          const contentType =
            imageFile.type === 'image' ? 'image/png' : 'video/mp4'

          const { data: imageData, error: imageError } = await supabase.storage
            .from(IMAGES_USERS_BUCKET)
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
          for (const path of savedImagePaths) {
            const { error: insertDealImageError } = await supabase
              .from('users')
              .update({
                avatar_url: path,
              })
              .eq('id', user.id)

            if (insertDealImageError) {
              showErrorMessage(insertDealImageError.message)
              setIsLoading(false)
              return
            }
          }

          if (profileImageFileUrls && profileImageFileUrls.length > 0) {
            await deleteUnlinkedImages(profileImageFileUrls)
          }

          showMessage({
            message: 'Profile updated!',
            type: 'success',
          })

          reset()
          setUserImage(null)
          setImageUri(null)

          navigation.goBack()
        }
      }
    } catch (error) {
      handleError(error, 'Error updating Profile')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUnlinkedImages = async (fileUrls: FileUrl[]): Promise<void> => {
    const filesToDelete = fileUrls

    for (const file of filesToDelete) {
      const { error: deleteFileError } = await supabase.storage
        .from(IMAGES)
        .remove([`${USERS}/${file.name}`])

      if (deleteFileError) {
        showErrorMessage(deleteFileError.message)
        setIsLoading(false)
      }
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
      setUserImage(img)

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
    const fetchData = async (): Promise<void> => {
      const currentUser = await getUser()
      if (currentUser) {
        try {
          setValue('full_name', currentUser.full_name ?? '')
          setValue('mobile_number', currentUser.mobile_number ?? '')

          if (typeof avatarUrl === 'string') {
            setImageUri(avatarUrl ?? null)
          }

          const imageFileUrls = await getFileUrls(
            IMAGES,
            USERS,
            currentUser.avatar_url ? [currentUser.avatar_url] : []
          )

          if (imageFileUrls.length > 0) {
            setProfileImageFileUrls(imageFileUrls)
          }
        } catch (error) {
          handleError(error, 'Error fetching user')
        }
      }
    }

    void fetchData()
  }, [])

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
          name='full_name'
          label='Full name'
          control={control}
          testID='full_name'
        />
        <ControlledInput
          name='mobile_number'
          label='Mobile Number'
          control={control}
          testID='mobile_number'
        />

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
              {imageUri ? 'Profile Image' : 'Select Profile Image'}
            </Text>
            <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
          </View>
        </TouchableOpacity>

        <Button
          label='Save'
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

export default EditProfile

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
