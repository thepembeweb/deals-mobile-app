/* eslint-disable max-len */
import { Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import useLoadImages from '../hooks/useLoadImages'
import { type Outlet } from '../types/supabase'
import { BLUR_HASH, IMAGES_OUTLETS_BUCKET } from '../utils/constants'

interface ManageOutletCardProps {
  outlet: Outlet
  index: number
}

const ManageOutletCard: React.FC<ManageOutletCardProps> = ({
  outlet,
  index,
}) => {
  const outletImageUrls = outlet.outlet_images?.map((a) => a.image_url) || []
  const imageUrls = useLoadImages(IMAGES_OUTLETS_BUCKET, outletImageUrls)
  const [featureImageSrc, setFeatureImageSrc] = useState(
    '/images/placeholder-image.png'
  )

  const displayImages = []
  if (imageUrls && imageUrls.length > 0) {
    const urls = [
      ...imageUrls,
      ...new Array(5 - imageUrls.length).fill('/images/placeholder-image.png'),
    ].slice(0, 5)
    displayImages.push(...urls)
  }

  useEffect(() => {
    const imageUrl =
      (imageUrls?.length && imageUrls[0]) || '/images/placeholder-image.png'

    setFeatureImageSrc(imageUrl)
  }, [imageUrls])

  return (
    <Link
      href={{
        pathname: '/(tabs)/profile/edit-outlet',
        params: {
          id: outlet.id,
        },
      }}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.card}>
          <Image
            alt='Outlet Image'
            style={styles.cardImg}
            source={{
              uri: featureImageSrc,
            }}
            placeholder={BLUR_HASH}
            contentFit='cover'
            transition={1000}
          />

          <View>
            <Text style={styles.cardTitle}>{outlet.title}</Text>

            {/* <Text style={styles.cardSubtitle}>{outlet.address}</Text> */}

            <View style={styles.cardStats}>
              <View style={styles.cardStatsItem}>
                {/* <Feather color='#636a73' name='map-pin' /> */}

                <Text style={styles.cardStatsItemText}>{outlet.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardAction}>
            <Feather color='#9ca3af' name='chevron-right' size={22} />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default ManageOutletCard

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
    width: 270,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#464646',
    marginBottom: 3,
    width: wp(70),
  },
  cardStats: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp(70),
  },
  cardStatsItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  cardStatsItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#636a73',
    marginLeft: 2,
  },
  cardAction: {
    marginLeft: 'auto',
  },
})
