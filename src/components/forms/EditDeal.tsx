/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { Feather, Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import { decode } from 'base64-arraybuffer'
import { set } from 'date-fns'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation, useRouter } from 'expo-router'
import mime from 'mime'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Chip } from 'react-native-paper'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import uuid from 'react-native-uuid'
import { z } from 'zod'

import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../providers/AuthProvider'
import {
  Button,
  ControlledInput,
  Input,
  type SelectOption,
} from '../../components/core'
import useLoadImage from '../../hooks/useLoadImage'
import colors from '../../theme/colors'
import { type Deal } from '../../types/supabase'
import {
  formatDate,
  handleError,
  isDate2GreaterThanDate1,
  parseFormattedDate,
  showErrorMessage,
} from '../../utils/common'
import {
  BLUR_HASH,
  DEAL_NATURE_PRODUCT_ID,
  DOCUMENTS_DEALS_BUCKET,
  IMAGES_DEALS_BUCKET,
} from '../../utils/constants'

const schema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  brand: z
    .string()
    .max(255, 'Please enter a valid value')
    .optional()
    .or(z.literal('')),
  model: z
    .string()
    .max(255, 'Please enter a valid value')
    .optional()
    .or(z.literal('')),
  specifications: z
    .string()
    .max(255, 'Please enter a valid value')
    .optional()
    .or(z.literal('')),
})

type FormType = z.infer<typeof schema>

interface AddDealProps {
  deal: Deal
  categories: SelectOption[]
  dealNatures: SelectOption[]
  outlets: SelectOption[]
  specialOffers: SelectOption[]
}

const EditDeal: React.FC<AddDealProps> = ({
  deal,
  categories,
  dealNatures,
  outlets,
  specialOffers,
}) => {
  const { user } = useAuth()
  const router = useRouter()
  const navigation = useNavigation()

  const imageUrl = useLoadImage(
    IMAGES_DEALS_BUCKET,
    deal.featured_image_url ?? ''
  )
  const formattedSrc = imageUrl ?? 'https://picsum.photos/300'

  const [isDealNatureProduct, setIsDealNatureProduct] = useState(false)

  const [selectedOutlets, setSelectedOutlets] = useState<SelectOption[]>([])
  const [outletOptions, setOutletOptions] = useState<SelectOption[]>([])
  const [selectedSpecialOffers, setSelectedSpecialOffers] = useState<
    SelectOption[]
  >([])
  const [specialOfferOptions, setSpecialOfferOptions] = useState<
    SelectOption[]
  >([])

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(String(categories[1].value))
    }
  }, [categories])

  useEffect(() => {
    if (dealNatures.length > 0) {
      setSelectedDealNature(String(dealNatures[0].value))
    }
  }, [dealNatures])

  useEffect(() => {
    setOutletOptions(outlets)
  }, [outlets])

  useEffect(() => {
    setSpecialOfferOptions(
      specialOffers.filter((option) => option.label !== 'None')
    )
  }, [specialOffers])

  // New Date2 starts
  const today = new Date()

  const [dateFrom, setDateFrom] = useState('')
  const [dateFromCurrent, setDateFromCurrent] = useState(new Date())
  const [showDateFromPicker, setShowDateFromPicker] = useState(false)
  const toggleDateFromPicker = (): void => {
    setShowDateFromPicker(!showDateFromPicker)
  }
  const onDateFromChange = (event: DateTimePickerEvent, date?: Date): void => {
    if (date === undefined) return
    if (event.type === 'set') {
      setDateFromCurrent(date)

      if (Platform.OS === 'android') {
        toggleDateFromPicker()
        setDateFrom(formatDate(date))
      }
    } else {
      toggleDateFromPicker()
    }
  }

  const [dateTo, setDateTo] = useState('')
  const [dateToCurrent, setDateToCurrent] = useState(new Date())
  const [showDateToPicker, setShowDateToPicker] = useState(false)
  const toggleDateToPicker = (): void => {
    setShowDateToPicker(!showDateToPicker)
  }
  const onDateToChange = (event: DateTimePickerEvent, date?: Date): void => {
    if (date === undefined) return
    if (event.type === 'set') {
      setDateToCurrent(date)

      if (Platform.OS === 'android') {
        toggleDateToPicker()
        setDateTo(formatDate(date))
      }
    } else {
      toggleDateToPicker()
    }
  }

  // New Date2 ends

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDealNature, setSelectedDealNature] = useState<string | null>(
    null
  )
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null)
  const [selectedSpecialOffer, setSelectedSpecialOffer] = useState<
    string | null
  >(null)

  const [imageUri, setImageUri] = useState<string | null>(null)
  const [dealImage, setDealImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null)
  const [documentUri, setDocumentUri] = useState<string | null>(null)
  const [dealDocument, setDealDocument] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    setImageUri(formattedSrc)
  }, [formattedSrc])

  const [actualPrice, setActualPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [finalPrice, setFinalPrice] = useState('')

  useEffect(() => {
    if (!actualPrice || !discountPercent) {
      return
    }

    const price = Number(actualPrice) * (1 - Number(discountPercent) / 100)
    setFinalPrice(String(price))
  }, [actualPrice, discountPercent, setValue])

  // const { mutate: addPost, isLoading } = useAddPost()

  const onSubmit = async (data: FormType): Promise<void> => {
    try {
      if (!user) {
        router.push('/login')
        return
      }

      if (selectedCategory === null) {
        showErrorMessage('Please select Category')
        return
      }

      if (selectedDealNature === null) {
        showErrorMessage('Please select Deal Nature')
        return
      }

      if (selectedOutlets.length === 0) {
        showErrorMessage('Please select at least one Outlet')
        return
      }

      if (actualPrice.length === 0) {
        showErrorMessage('Please enter Price')
        return
      }

      if (discountPercent.length === 0) {
        showErrorMessage('Please enter Percentage')
        return
      }

      if (!isDate2GreaterThanDate1(dateFromCurrent, dateToCurrent)) {
        showErrorMessage(
          "'Active From' date should be greater than 'Active To' date"
        )
        return
      }

      if (dealImage === null) {
        showErrorMessage('Please select Deal Image')
        return
      }

      setIsLoading(true)
      const { data: dealData, error: insertDealError } = await supabase
        .from('deals')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          category_id: selectedCategory,
          brand: data.brand ?? null,
          model: data.model ?? null,
          nature_id: selectedDealNature,
          specifications: data.specifications ?? null,
          actual_price: actualPrice,
          final_price: finalPrice,
          discount_percent: discountPercent,
          active_from: dateFromCurrent,
          active_to: dateToCurrent,
        })
        .select()

      if (insertDealError) {
        showErrorMessage(insertDealError.message)
        setIsLoading(false)
        return
      }

      const dealId = dealData[0].id

      // Upload outlet images
      const savedImagePaths = []
      for (const imageFile of [dealImage]) {
        const uniqueID = uuid.v4() as string

        const content = await FileSystem.readAsStringAsync(imageFile.uri, {
          encoding: FileSystem.EncodingType.Base64,
        })

        const filePath = `image-${dealId}-${uniqueID}`
        // const contentType =
        //   imageFile.type === 'image' ? 'image/png' : 'video/mp4'

        const contentType =
          mime.getType(imageFile.fileName ?? 'png') ?? 'image/png'

        const { data: imageData, error: imageError } = await supabase.storage
          .from(IMAGES_DEALS_BUCKET)
          .upload(filePath, decode(content), {
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
          const { error: insertDealImageError } = await supabase
            .from('deal_images')
            .insert({
              image_url: path,
              deal_id: dealId,
              sort_order: index + 1,
            })

          if (insertDealImageError) {
            showErrorMessage(insertDealImageError.message)
            setIsLoading(false)
            return
          }
        }
      }

      await updateDealFeaturedImage(dealId, savedImagePaths)

      // Upload deal documents
      if (dealDocument) {
        const savedDocumentPaths = []
        for (const documentFile of [dealDocument]) {
          const uniqueID = uuid.v4() as string

          const content = await FileSystem.readAsStringAsync(documentFile.uri, {
            encoding: FileSystem.EncodingType.Base64,
          })

          const filePath = `document-${dealId}-${uniqueID}`

          const { data: documentData, error: imageError } =
            await supabase.storage
              .from(DOCUMENTS_DEALS_BUCKET)
              .upload(filePath, decode(content), {
                contentType: dealDocument.mimeType,
                cacheControl: '3600',
                upsert: false,
              })

          if (imageError) {
            setIsLoading(false)
            showErrorMessage('Failed document upload')
            setIsLoading(false)
            return
          }

          savedDocumentPaths.push(documentData.path)

          // Create deal_additional_documents records
          for (const [path] of savedDocumentPaths.entries()) {
            const { error: insertDealDocumentError } = await supabase
              .from('deal_additional_documents')
              .insert({
                additional_document: path,
                deal_id: dealId,
              })

            if (insertDealDocumentError) {
              showErrorMessage(insertDealDocumentError.message)
              setIsLoading(false)
              return
            }
          }
        }
      }

      // Create deal_outlets records
      for (const outlet of selectedOutlets) {
        const { error: insertDealOutletError } = await supabase
          .from('deal_outlets')
          .insert({
            deal_id: dealId,
            outlet_id: outlet.value,
          })

        if (insertDealOutletError) {
          showErrorMessage(insertDealOutletError.message)
          setIsLoading(false)
          return
        }
      }

      // Create deal_special_offers records
      for (const specialOffer of selectedSpecialOffers) {
        const { error: insertDealSpecialOfferError } = await supabase
          .from('deal_special_offers')
          .insert({
            deal_id: dealId,
            special_offer_id: specialOffer.value,
          })

        if (insertDealSpecialOfferError) {
          showErrorMessage(insertDealSpecialOfferError.message)
          setIsLoading(false)
          return
        }
      }

      showMessage({
        message: 'Deal saved!',
        type: 'success',
      })

      navigation.goBack()

      // --------------------------------------
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
      handleError(error, 'Error updating Deal')
    } finally {
      setIsLoading(false)
    }
  }

  const updateDealFeaturedImage = async (
    id: number,
    imagePaths: string[]
  ): Promise<void> => {
    if (imagePaths.length === 0) {
      return
    }

    const [firstImagePath] = imagePaths
    const { error } = await supabase
      .from('deals')
      .update({ featured_image_url: firstImagePath })
      .eq('id', id)

    if (error) {
      showErrorMessage(error.message)
      setIsLoading(false)
    }
  }

  const onSelectImage = async (): Promise<void> => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        // allowsMultipleSelection: true,
        // selectionLimit: 4,
      }

      const result = await ImagePicker.launchImageLibraryAsync(options)

      if (!result.assets) return
      const img = result.assets[0]
      setImageUri(img.uri)
      setDealImage(img)
    } catch (error) {
      handleError(error, 'Error selecting image')
    }
  }

  const onSelectDocument = async (): Promise<void> => {
    try {
      const options: DocumentPicker.DocumentPickerOptions = {
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      }

      const result = await DocumentPicker.getDocumentAsync(options)

      const assets = result.assets
      if (!assets) return

      const file = assets[0]
      setDocumentUri(file.uri)
      setDealDocument(file)
    } catch (error) {
      handleError(error, 'Error selecting document')
    }
  }

  useEffect(() => {
    if (deal) {
      setValue('title', deal.title ?? '')
      setValue('description', deal.description ?? '')
      setValue('brand', deal.brand ?? '')
      setValue('model', deal.model ?? '')
      setValue('specifications', deal.specifications ?? '')

      setSelectedCategory(String(deal.category_id))
      setSelectedDealNature(String(deal.nature_id))
      // setSelectedOutlets(deal.outlets)
      // setSelectedSpecialOffers(deal.special_offers)

      setActualPrice(String(deal.actual_price))
      setDiscountPercent(String(deal.discount_percent))
      setFinalPrice(String(deal.final_price))

      if (deal.active_from) {
        setDateFrom(deal.active_from)
        setDateFromCurrent(new Date(deal.active_from))
      }

      if (deal.active_to) {
        setDateTo(deal.active_to)
        setDateFromCurrent(new Date(deal.active_to))
      }

      // setDateFromCurrent(new Date(deal.active_from))
      // setDateToCurrent(new Date(deal.active_to))

      // category_id: selectedCategory,
      // nature_id: selectedDealNature,

      if (deal.deal_natures.id) {
        setIsDealNatureProduct(
          String(deal.deal_natures.id) === DEAL_NATURE_PRODUCT_ID
        )
      }
    }
  }, [deal, setValue])

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
          {'Add Deal'}
        </Text>
      </View>
      <View className='flex-1 p-4 '>
        <View className='mb-4'>
          <Text className='text-base text-black dark:text-white font-inter font-normal'>
            {'Category:'}
          </Text>
          <Input
            autoCapitalize='none'
            keyboardType='numeric'
            value={deal.categories.title}
            editable={false}
            onChangeText={(text) => {
              setFinalPrice(text.replace(/[^0-9]/g, ''))
            }}
          />
        </View>

        <View className='mb-4'>
          <Text className='text-base text-black dark:text-white font-inter font-normal'>
            {'Deal Nature:'}
          </Text>
          <Input
            autoCapitalize='none'
            keyboardType='numeric'
            value={deal.deal_natures.title}
            editable={false}
            onChangeText={(text) => {
              setFinalPrice(text.replace(/[^0-9]/g, ''))
            }}
          />
        </View>

        <ControlledInput
          name='title'
          label='Deal Title'
          control={control}
          testID='title'
        />
        <ControlledInput
          name='description'
          label='About the Deal'
          control={control}
          multiline
          testID='description'
        />

        {isDealNatureProduct && (
          <>
            <ControlledInput
              name='brand'
              label='Brand'
              control={control}
              testID='brand'
            />
            <ControlledInput
              name='model'
              label='Model'
              control={control}
              testID='model'
            />
          </>
        )}

        <ControlledInput
          name='specifications'
          label='Specifications'
          control={control}
          multiline
          testID='specifications'
        />

        <View className='mb-4'>
          <TouchableOpacity>
            <Text className='text-base text-black dark:text-white font-inter font-normal'>
              {'Outlets:'}
            </Text>
            {selectedOutlets.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  padding: 16,
                  borderColor: colors.grey,
                  borderWidth: 1,
                }}
              >
                {selectedOutlets.map((c) => (
                  <Chip
                    key={c.value}
                    mode='outlined'
                    selected
                    showSelectedOverlay
                    style={{ margin: 4 }}
                    onPress={() => {
                      setSelectedOutlets(
                        selectedOutlets.filter((item) => item.value !== c.value)
                      )

                      setOutletOptions([
                        ...outletOptions,
                        outlets.filter((o) => o.value === c.value)[0],
                      ])
                    }}
                  >
                    {c.label}
                  </Chip>
                ))}
              </View>
            )}

            {outletOptions.length !== 0 && (
              <View
                className={
                  'mt-0 flex-row items-center justify-center border-[1px] px-2 border-neutral-400 rounded-md bg-neutral-200 text-[16px]'
                }
              >
                <View style={{ flex: 1 }}>
                  <Picker
                    selectedValue={selectedOutlet}
                    onValueChange={(itemValue) => {
                      setSelectedOutlet('-1')

                      if (!selectedOutlets.some((a) => a.value === itemValue)) {
                        setSelectedOutlets([
                          ...selectedOutlets,
                          outlets.filter((c) => c.value === itemValue)[0],
                        ])

                        setOutletOptions(
                          outletOptions.filter(
                            (item) => item.value !== itemValue
                          )
                        )
                      }
                    }}
                    enabled={outletOptions.length !== 0}
                  >
                    {[
                      { value: -1, label: '-- Select --' },
                      ...outletOptions,
                    ].map((c) => (
                      <Picker.Item
                        key={c.value}
                        label={c.label}
                        value={c.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mb-4'>
          <TouchableOpacity>
            <Text className='text-base text-black dark:text-white font-inter font-normal'>
              {'Special Offers:'}
            </Text>
            {selectedSpecialOffers.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  padding: 16,
                  borderColor: colors.grey,
                  borderWidth: 1,
                }}
              >
                {selectedSpecialOffers.map((c) => (
                  <Chip
                    key={c.value}
                    mode='outlined'
                    selected
                    showSelectedOverlay
                    style={{ margin: 4 }}
                    onPress={() => {
                      setSelectedSpecialOffers(
                        selectedSpecialOffers.filter(
                          (item) => item.value !== c.value
                        )
                      )

                      setSpecialOfferOptions([
                        ...specialOfferOptions,
                        specialOffers.filter((o) => o.value === c.value)[0],
                      ])
                    }}
                  >
                    {c.label}
                  </Chip>
                ))}
              </View>
            )}

            {specialOfferOptions.length !== 0 && (
              <View
                className={
                  'mt-0 flex-row items-center justify-center border-[1px] px-2 border-neutral-400 rounded-md bg-neutral-200 text-[16px]'
                }
              >
                <View style={{ flex: 1 }}>
                  <Picker
                    selectedValue={selectedSpecialOffer}
                    onValueChange={(itemValue) => {
                      setSelectedSpecialOffer('-1')

                      if (
                        !selectedSpecialOffers.some(
                          (a) => a.value === itemValue
                        )
                      ) {
                        setSelectedSpecialOffers([
                          ...selectedSpecialOffers,
                          specialOffers.filter((c) => c.value === itemValue)[0],
                        ])

                        setSpecialOfferOptions(
                          specialOfferOptions.filter(
                            (item) => item.value !== itemValue
                          )
                        )
                      }
                    }}
                    enabled={specialOfferOptions.length !== 0}
                  >
                    {[
                      { value: -1, label: '-- Select --' },
                      ...specialOfferOptions,
                    ].map((c) => (
                      <Picker.Item
                        key={c.value}
                        label={c.label}
                        value={c.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mb-4'>
          <Text className='text-base text-black dark:text-white font-inter font-normal'>
            {'Price (Including Tax):'}
          </Text>
          <Input
            autoCapitalize='none'
            // actualPrice, discountPercent
            // onChangeText={field.onChange}
            // value={field.value as string}
            // error={fieldState.error?.message}
            keyboardType='numeric'
            value={actualPrice}
            onChangeText={(text) => {
              setActualPrice(text.replace(/[^0-9]/g, ''))
            }}
            placeholder='Enter number'
          />
        </View>

        <View className='mb-4'>
          <Text className='text-base text-black dark:text-white font-inter font-normal'>
            {'Discount Percentage (%):'}
          </Text>
          <Input
            autoCapitalize='none'
            keyboardType='numeric'
            value={discountPercent}
            onChangeText={(text) => {
              setDiscountPercent(text.replace(/[^0-9]/g, ''))
            }}
            placeholder='Enter number'
          />
        </View>

        <View className='mb-4'>
          <Text className='text-base text-black dark:text-white font-inter font-normal'>
            {'Final Price:'}
          </Text>
          <Input
            autoCapitalize='none'
            keyboardType='numeric'
            value={finalPrice}
            editable={false}
            onChangeText={(text) => {
              setFinalPrice(text.replace(/[^0-9]/g, ''))
            }}
          />
        </View>

        <View>
          <TouchableOpacity onPress={toggleDateFromPicker}>
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
              <Ionicons name='calendar' size={20} color={colors.medium} />
              <Text style={{ flex: 1, fontSize: hp(2.3) }}>
                {'Active From:'}
              </Text>
              <Text style={{ flex: 1, fontSize: hp(2.3) }}>
                {dateFrom || formatDate(today)}
              </Text>
              <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
            </View>
          </TouchableOpacity>
          {useMemo(() => {
            return (
              Platform.OS === 'android' &&
              showDateFromPicker && (
                <DateTimePicker
                  mode='date'
                  display='spinner'
                  value={dateFromCurrent}
                  onChange={onDateFromChange}
                  style={styles.datePicker}
                />
              )
            )
          }, [showDateFromPicker])}

          <Modal
            animationType='slide'
            transparent={true}
            visible={showDateFromPicker && Platform.OS === 'ios'}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {useMemo(() => {
                  return (
                    <DateTimePicker
                      mode='date'
                      display='spinner'
                      value={dateFromCurrent}
                      onChange={onDateFromChange}
                      style={styles.datePicker}
                    />
                  )
                }, [showDateFromPicker])}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    backgroundColor: '#FFF',
                    width: '100%',
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.pickerButton,
                      { backgroundColor: '#11182711' },
                    ]}
                    onPress={toggleDateFromPicker}
                  >
                    <Text style={[styles.buttonText, { color: '#075985' }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.pickerButton]}
                    onPress={() => {
                      setDateFrom(formatDate(dateFromCurrent))
                      toggleDateFromPicker()
                    }}
                  >
                    <Text style={[styles.buttonText]}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View>
          <TouchableOpacity onPress={toggleDateToPicker}>
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
              <Ionicons name='calendar' size={20} color={colors.medium} />
              <Text style={{ flex: 1, fontSize: hp(2.3) }}>{'Active To:'}</Text>
              <Text style={{ flex: 1, fontSize: hp(2.3) }}>
                {dateTo || formatDate(today)}
              </Text>
              <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
            </View>
          </TouchableOpacity>
          {useMemo(() => {
            return (
              Platform.OS === 'android' &&
              showDateToPicker && (
                <DateTimePicker
                  mode='date'
                  display='spinner'
                  value={dateToCurrent}
                  onChange={onDateToChange}
                  style={styles.datePicker}
                />
              )
            )
          }, [showDateToPicker])}

          <Modal
            animationType='slide'
            transparent={true}
            visible={showDateToPicker && Platform.OS === 'ios'}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {useMemo(() => {
                  return (
                    <DateTimePicker
                      mode='date'
                      display='spinner'
                      value={dateToCurrent}
                      onChange={onDateToChange}
                      style={styles.datePicker}
                    />
                  )
                }, [showDateToPicker])}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    backgroundColor: '#FFF',
                    width: '100%',
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.pickerButton,
                      { backgroundColor: '#11182711' },
                    ]}
                    onPress={toggleDateToPicker}
                  >
                    <Text style={[styles.buttonText, { color: '#075985' }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.pickerButton]}
                    onPress={() => {
                      setDateTo(formatDate(dateToCurrent))
                      toggleDateToPicker()
                    }}
                  >
                    <Text style={[styles.buttonText]}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View className={'mb-4'}>
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
                {imageUri ? 'Deal Image' : 'Select Deal Image'}
              </Text>
              <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
            </View>
          </TouchableOpacity>
        </View>

        <View className={'mb-4'}>
          <TouchableOpacity
            onPress={() => {
              void onSelectDocument()
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

              {documentUri ? (
                <Ionicons
                  // style={[styles.avatar, styles.image]}
                  name='document'
                  size={150}
                  color={colors.medium}
                />
              ) : (
                <View style={[styles.avatar, styles.noImage]} />
              )}
              <Text style={{ flex: 1 }}>
                {documentUri ? 'Deal Document' : 'Select Deal Document'}
              </Text>
              <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
            </View>
          </TouchableOpacity>
        </View>

        <Button
          label='Add Deal'
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

export default EditDeal

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
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
    color: '#111827cc',
  },
  input: {
    backgroundColor: 'transparent',
    height: 50,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827cc',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#11182711',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#075985',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  pickerButton: {
    paddingHorizontal: 20,
  },

  textHeader: {
    fontSize: 36,
    marginVertical: 60,
    color: '#111',
  },
  textSubHeader: {
    fontSize: 25,
    color: '#111',
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#222',
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: 'center',
    marginTop: 14,
  },
  submitBtn: {
    backgroundColor: '#342342',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    // backgroundColor: '#080516',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
