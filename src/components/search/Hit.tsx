/* eslint-disable max-len */
import { type Hit as AlgoliaHit } from '@algolia/client-search'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React from 'react'
import {
  Dimensions,
  // Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import useLoadImage from '../../hooks/useLoadImage'
import { formatToOneDecimalPlace } from '../../utils/common'
import { BLUR_HASH, IMAGES_DEALS_BUCKET } from '../../utils/constants'

// type DealHit = AlgoliaHit<{
//   title: string
//   price: number
//   actual_price: number
//   discount_percent: number
//   image: string
//   popularity: number
//   rating: number
//   categories: string[]
// }>

export type DealHit = AlgoliaHit<{
  rank: number
  dealId: number
  deal_title: string
  description: string
  categories: string[]
  natures: string[]
  special_offers: string[]
  model: string
  brand: string
  specifications: string
  actual_price: number
  final_price: number
  deal_percent: number
  deal_rating: number
  deal_popularity: number
  featured_image_urls: string[]
  additional_documents: string[]
  outlet_id: number
  outlet_title: string
  outlet_rating: number
  outlet_latitude: number
  outlet_longitude: number
  outlet_image_urls: string[]
  objectID: string
}>

interface HitProps {
  hit: DealHit
  index: number
}

const Hit = ({ hit, index }: HitProps): JSX.Element => {
  const router = useRouter()
  const imageUrl = useLoadImage(
    IMAGES_DEALS_BUCKET,
    hit.featured_image_urls[0] ?? ''
  )
  const formattedSrc = imageUrl ?? 'https://picsum.photos/300'
  const sharedTransitionTag = `hit-${hit.dealId}`

  return (
    <MotiView
      style={styles.listContainer}
      className='bg-white rounded-2xl shadow-lg'
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 1000 + index * 200 }}
    >
      <Pressable
        onPress={() => {
          router.push({
            pathname: `/home/${hit.dealId}`,
            params: {
              featuredImageUrl: formattedSrc,
              sharedTransitionTag: sharedTransitionTag ?? '',
            },
          })
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            className='h-36 w-full rounded-t-2xl mx-auto'
            style={styles.image}
            source={formattedSrc}
            placeholder={BLUR_HASH}
            contentFit='cover'
            transition={1000}
          />
        </View>
        <Text style={styles.nameText} numberOfLines={1} ellipsizeMode='tail'>
          {hit.deal_title}
        </Text>
        <Text style={styles.outletText} numberOfLines={1} ellipsizeMode='tail'>
          {hit.outlet_title}
        </Text>

        <View
          style={{ marginLeft: 15, paddingVertical: 5 }}
          className='flex-row items-center space-x-1'
        >
          <Image
            source={require('../../../assets/images/fullStar.png')}
            className='h-4 w-4'
          />
          <Text style={{ fontSize: hp(1.8) }}>
            <Text className='text-green-700'>
              {formatToOneDecimalPlace(hit.deal_rating)}
            </Text>
            <Text className='text-gray-700'> ({hit.deal_popularity})</Text>
          </Text>
        </View>
        <View
          style={{ marginBottom: 10, marginLeft: 15, paddingVertical: 5 }}
          className='flex-row items-center space-x-1'
        >
          <Text style={{ fontSize: hp(1.7) }} className='font-semibold'>
            ₹{hit.final_price}
          </Text>
          <Text
            style={{ fontSize: hp(1.5) }}
            className='font-semibold text-green-600 line-through'
          >
            ₹{hit.actual_price}
          </Text>
          <Text
            style={{ fontSize: hp(1.5) }}
            className='font-semibold text-green-600'
          >
            ({hit.deal_percent}% off)
          </Text>
        </View>

        {/* <Text style={styles.priceText}>{hit.price}</Text> */}
        {/* <TouchableWithoutFeedback
          onPress={() => {
            console.log('BUY NOW!', index)
          }}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Buy Now!</Text>
          </View>
        </TouchableWithoutFeedback> */}
      </Pressable>
    </MotiView>
  )
}

export default Hit

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FD',
  },
  listContainer: {
    width: Dimensions.get('window').width / 2 - 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 20,
  },
  imageContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: { width: '100%', height: undefined, aspectRatio: 1 },
  nameText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 15,

    // width: '100%',
    paddingVertical: 0,
    // fontSize: 12,
    fontSize: hp(1.5),
  },
  outletText: {
    color: 'black',
    fontWeight: 'normal',
    marginLeft: 15,
    paddingVertical: 3,
    fontSize: hp(1.5),
  },
  priceText: {
    color: 'orange',
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#62513E',
    padding: 10,
    margin: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  singleLineText: {
    width: '100%',
    paddingVertical: 5,
    fontSize: 14,
  },
})
