import { MultipleQueriesQuery } from '@algolia/client-search'
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
import Hit from '../components/search/Hit'
import { InfiniteHits } from '../components/search/InfiniteHits'
import { SearchBox } from '../components/search/SearchBox'
import { useLocationStore } from '../store/locationStore'
import { type ProductHit } from '../types/algolia'
// import LoadingIndicator from './LoadingIndicator'

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

// const algoliaClient = algoliasearch(
//   '2YCPBB4QOM',
//   'a5cecbf3f48a1218e6f2743f1f11fb98'
// )

const index = process.env.EXPO_PUBLIC_ALGOLIA_INDEX
const suggestionsIndexName =
  process.env.EXPO_PUBLIC_INSTANT_SEARCH_QUERY_SUGGESTIONS

const algoliaClient = algoliasearch(
  process.env.EXPO_PUBLIC_ALGOLIA_APP_ID ?? '',
  process.env.EXPO_PUBLIC_ALGOLIA_API_KEY ?? ''
)
const searchClient = {
  ...algoliaClient,
  // async search(requests: readonly MultipleQueriesQuery[]) {
  async search(requests: any) {
    if (requests.every(({ params }) => !params?.query)) {
      return await Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: '',
          params: '',
        })),
      })
    }

    return await algoliaClient.search(requests)
  },
}

const SearchScreen = (): JSX.Element => {
  const navigation = useNavigation()
  const router = useRouter()

  const [isModalOpen, setModalOpen] = useState(false)
  const listRef = useRef<FlashList<any>>(null)
  const [isGridReady, setIsGridReady] = useState(false)
  const [query, setQuery] = useState('')

  const userLocationCoordinates = useLocationStore(
    (state) => state.userLocationCoordinates
  )

  function scrollToTop(): void {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 })
  }
  return (
    <SafeAreaView className='flex-1 top-14'>
      <StatusBar style='dark' />
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
          <SearchBox
            onChange={(value) => {
              console.log('OLA: value', value)
              setQuery(value)
              setIsGridReady(true)
              listRef.current?.scrollToOffset({ animated: false, offset: 0 })
            }}
            onToggleFilters={() => {
              setModalOpen(!isModalOpen)
            }}
            suggestionsIndexName={suggestionsIndexName}
          />
          <InfiniteHits
            ref={listRef}
            hitComponent={Hit}
            isReady={isGridReady}
            query={query}
            userLocationCoordinates={userLocationCoordinates}
          />
        </InstantSearch>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // backgroundColor: '#252b33',
    // @ts-expect-error 100vh is valid but not recognized by react-native
    height: Platform.OS === 'web' ? '100vh' : '100%',
    paddingTop: Platform.OS === 'web' ? 0 : 25,
  },
  container: {
    flex: 1,
    // backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
})

export default SearchScreen
