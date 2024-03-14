/* eslint-disable max-len */
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import useLoadImage from '../hooks/useLoadImage'
import { type Deal } from '../types/supabase'
import { formatDate } from '../utils/common'
import { BLUR_HASH, IMAGES_DEALS_BUCKET } from '../utils/constants'

interface ManageDealCardProps {
  deal: Deal
  index: number
}

const ManageDealCard: React.FC<ManageDealCardProps> = ({ deal, index }) => {
  const imageUrl = useLoadImage(
    IMAGES_DEALS_BUCKET,
    deal.featured_image_url ?? ''
  )
  const formattedSrc = imageUrl ?? 'https://picsum.photos/300'

  return (
    <Link
      href={{
        pathname: '/(tabs)/profile/edit-deal',
        params: {
          id: deal.id,
        },
      }}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.card}>
          <Image
            alt='Deal Image'
            source={{
              uri: formattedSrc,
            }}
            style={styles.cardImg}
            placeholder={BLUR_HASH}
            contentFit='cover'
            transition={1000}
          />

          <View style={styles.cardBody}>
            <Text style={styles.cardTag}>{deal.categories.title}</Text>

            <Text
              style={styles.cardTitle}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {deal.title}
            </Text>

            <View className='flex-row justify-between items-center w-full'>
              <View style={styles.cardRow}>
                <View style={styles.cardRowItem}>
                  {/* <Image
                alt=''
                source={{
                  uri: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
                }}
                style={styles.cardRowItemImg}
              /> */}

                  <Text style={styles.cardRowItemText}>
                    ₹{deal.final_price}
                  </Text>
                </View>

                <Text style={styles.cardRowDivider}>·</Text>

                <View style={styles.cardRowItem}>
                  <Text style={styles.cardRowItemText}>
                    {formatDate(new Date(deal.created_at))}
                  </Text>
                </View>
              </View>

              {/* <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={{ marginLeft: 'auto' }}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Edit</Text>
              </View>
            </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default ManageDealCard

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
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardImg: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  cardBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  cardTag: {
    fontWeight: '500',
    fontSize: 12,
    color: '#939393',
    marginBottom: 7,
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 19,
    color: '#000',
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -8,
    marginBottom: 1,
  },
  cardRowDivider: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#939393',
  },
  cardRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderColor: 'transparent',
  },
  cardRowItemText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#939393',
  },
  cardRowItemImg: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    marginRight: 6,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    backgroundColor: '#173153',
    borderColor: '#173153',
    marginLeft: 'auto',
  },
  btnText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#fff',
  },
})
