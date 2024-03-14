import { type FlashList } from '@shopify/flash-list'
import algoliasearch from 'algoliasearch/lite'
import { useNavigation, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useRef, useState } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Autocomplete } from '../components/search/Autocomplete'
import { Filters } from '../components/search/Filters'
import { Highlight } from '../components/search/Highlight'
import { InfiniteHits } from '../components/search/InfiniteHits'
import { SearchBox } from '../components/search/SearchBox'
import { type ProductHit } from '../types/algolia'

// const searchClient = algoliasearch(
//   'latency',
//   '6be0576ff61c053d5f9a3225e2a90f76'
// )
// const index = 'instant_search'

// const searchClient = algoliasearch(
//   process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
//   process.env.EXPO_PUBLIC_ALGOLIA_API_KEY ?? ''
// )
// const index = process.env.EXPO_PUBLIC_ALGOLIA_INDEX ?? ''
const searchClient = algoliasearch(
  '2YCPBB4QOM',
  'a5cecbf3f48a1218e6f2743f1f11fb98'
)
const index = 'test_thia_deals'
const suggestionsIndexName = 'test_thia_deals_query_suggestions'

const SearchResultsScreen = () => {
  const navigation = useNavigation()
  const router = useRouter()

  const [isModalOpen, setModalOpen] = useState(false)
  const listRef = useRef<FlashList<any>>(null)

  function scrollToTop(): void {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 })
  }
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style='light' />
      <View style={styles.container}>
        <InstantSearch searchClient={searchClient} indexName={index}>
          <Configure highlightPreTag='<mark>' highlightPostTag='</mark>' />
          {/* <SearchBox
            onChange={scrollToTop}
            onToggleFilters={() => {
              setModalOpen(!isModalOpen)
            }}
          /> */}
          <Filters
            isModalOpen={isModalOpen}
            onToggleModal={() => {
              setModalOpen(!isModalOpen)
            }}
            onChange={scrollToTop}
          />
          <Autocomplete
            onChange={() =>
              listRef.current?.scrollToOffset({ animated: false, offset: 0 })
            }
            suggestionsIndexName={suggestionsIndexName}
            onToggleFilters={() => {
              setModalOpen(!isModalOpen)
            }}
          />
          <SearchBox
            onChange={() =>
              listRef.current?.scrollToOffset({ animated: false, offset: 0 })
            }
            onToggleFilters={() => {
              setModalOpen(!isModalOpen)
            }}
          />
          <InfiniteHits ref={listRef} hitComponent={Hit} />
        </InstantSearch>
      </View>
    </SafeAreaView>
  )
}

interface HitProps {
  hit: ProductHit
}

const Hit = ({ hit }: HitProps): JSX.Element => {
  const router = useRouter()

  console.log('hit', hit)
  return (
    <Pressable
      onPress={() => {
        // router.replace("/profile");

        // router.push({
        //     pathname: `/home/${deal.id}`,
        //     params: {
        //       featured_image_url: formattedSrc,
        //       sharedTransitionTag: deal.sharedTransitionTag ?? "",
        //     },
        //   });

        const formattedSrc = 'https://picsum.photos/300'
        const sharedTransitionTag = ''

        router.push({
          pathname: `/home/${hit.objectID}}`,
          params: {
            featured_image_url: formattedSrc,
            sharedTransitionTag: sharedTransitionTag ?? '',
          },
        })
      }}
    >
      <Text>
        <Highlight hit={hit} attribute='title' />
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#252b33',
    // @ts-expect-error 100vh is valid but not recognized by react-native
    height: Platform.OS === 'web' ? '100vh' : '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
})

export default SearchResultsScreen
