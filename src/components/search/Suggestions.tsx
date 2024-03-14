import { type Hit as AlgoliaHit } from '@algolia/client-search'
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { Configure, Index, useHits } from 'react-instantsearch-core'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Highlight } from './Highlight'

type SuggestionHit = AlgoliaHit<{
  indexName: string
  query: string
}>

interface SuggestionsProps {
  indexName: string
  onSelect: (value: string) => void
}

export const Suggestions = ({ indexName, onSelect }: SuggestionsProps) => {
  return (
    <View style={styles.overlay}>
      <Index indexName={indexName}>
        <Configure hitsPerPage={5} />
        <View style={styles.list}>
          {/* <Text style={styles.listTitle}>Suggestions</Text> */}
          <List onSelect={onSelect} />
        </View>
      </Index>
    </View>
  )
}

interface ListProps {
  onSelect: (value: string) => void
}

const List = ({ onSelect }: ListProps): JSX.Element => {
  const { hits } = useHits()
  return (
    <View style={{ flexGrow: 1, flexDirection: 'row', minHeight: 2 }}>
      <FlashList
        data={hits}
        keyExtractor={(item) => item.objectID}
        renderItem={({ item }) => (
          <Suggestion
            hit={item as unknown as SuggestionHit}
            onPress={onSelect}
          />
        )}
        keyboardShouldPersistTaps='always'
        estimatedItemSize={61}
      ></FlashList>
    </View>
  )
}

interface SuggestionProps {
  hit: SuggestionHit
  onPress: (value: string) => void
}

const Suggestion = ({ hit, onPress }: SuggestionProps): JSX.Element => {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      onPress={() => {
        onPress(hit.query)
      }}
    >
      <Feather name='search' size={25} color='gray' style={styles.itemIcon} />
      <Highlight
        hit={hit}
        attribute='query'
        highlightedStyle={styles.highlighted}
        nonHighlightedStyle={styles.nonHighlighted}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 84,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: '#000000aa',
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  list: {
    backgroundColor: '#ffffff',
    padding: 9,
    paddingTop: 0,
  },
  listTitle: {
    fontSize: 18,
    padding: 9,
    paddingBottom: 9,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingLeft: 9,
    borderRadius: 8,
  },
  itemIcon: {
    marginRight: 9,
  },
  itemPressed: {
    backgroundColor: '#f0f0f0',
  },
  highlighted: {
    fontWeight: 'normal',
    color: 'black',
  },
  nonHighlighted: {
    fontWeight: 'bold',
    color: 'black',
  },
})
