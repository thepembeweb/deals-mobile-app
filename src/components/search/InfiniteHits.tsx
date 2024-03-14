import { type Hit as AlgoliaHit } from '@algolia/client-search'
import { FlashList } from '@shopify/flash-list'
import React, { forwardRef } from 'react'
import {
  useInfiniteHits,
  type UseInfiniteHitsProps,
} from 'react-instantsearch-core'
import { StyleSheet, View } from 'react-native'

import { type DealHit } from '../../components/search/Hit'
import { type LatLngCoordinates } from '../../types/supabase'
import EmptyList from '../EmptyList'

type InfiniteHitsProps<THit> = UseInfiniteHitsProps & {
  hitComponent: (props: { hit: THit; index: number }) => JSX.Element
  isReady?: boolean
  query?: string
  userLocationCoordinates?: LatLngCoordinates | null
}

// eslint-disable-next-line react/display-name
export const InfiniteHits = forwardRef(
  <THit extends AlgoliaHit<Record<string, unknown>>>(
    {
      hitComponent: Hit,
      isReady = false,
      query = '',
      userLocationCoordinates = null,
      ...props
    }: InfiniteHitsProps<THit>,
    ref: React.ForwardedRef<FlashList<THit>>
  ) => {
    const { hits, isLastPage, showMore } = useInfiniteHits({
      ...props,
      escapeHTML: false,
    })

    if (!isReady || query === '') {
      return null
    }
    if (query !== '' && hits.length === 0) {
      return null
    }

    let sortedHits = hits

    if (userLocationCoordinates) {
      sortedHits = hits

      const toRad = (value: number): number => {
        return (value * Math.PI) / 180
      }

      // Implementation of the Haversine Formula
      const distance = (
        location1: LatLngCoordinates,
        location2: DealHit
      ): number => {
        const EARTH_RADIUS = 6371 // Radius of the Earth in km
        const dLat = toRad(location2.outlet_latitude - location1.latitude)
        const dLon = toRad(location2.outlet_longitude - location1.longitude)
        const lat1 = toRad(location1.latitude)
        const lat2 = toRad(location2.outlet_latitude)

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return EARTH_RADIUS * c // Distance in km
      }

      sortedHits.sort(
        (a, b) =>
          distance(userLocationCoordinates, a as unknown as DealHit) -
          distance(userLocationCoordinates, b as unknown as DealHit)
      )
    }

    return (
      <FlashList
        ref={ref}
        data={sortedHits as unknown as THit[]}
        keyExtractor={(item) => item.objectID}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => {
          if (!isLastPage) {
            showMore()
          }
        }}
        ListEmptyComponent={
          <EmptyList message={`No results found for '${query}'`} />
        }
        estimatedItemSize={73}
        numColumns={2}
        renderItem={({ item, index }) => (
          <Hit hit={item as unknown as THit} index={index} />
        )}
      />
    )
  }
)

const styles = StyleSheet.create({
  separator: {
    // borderWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: 'red',
  },
})

declare module 'react' {
  // eslint-disable-next-line no-shadow
  function forwardRef<TRef, TProps = unknown>(
    render: (props: TProps, ref: React.Ref<TRef>) => React.ReactElement | null
  ): (props: TProps & React.RefAttributes<TRef>) => React.ReactElement | null
}
