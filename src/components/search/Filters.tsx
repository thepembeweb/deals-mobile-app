import React from 'react'
import {
  useClearRefinements,
  useCurrentRefinements,
  useRefinementList,
} from 'react-instantsearch-core'
import {
  Button,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface FiltersProps {
  isModalOpen: boolean
  onToggleModal: () => void
  onChange: () => void
  filtersText?: string
}

export const Filters = ({
  isModalOpen,
  onToggleModal,
  onChange,
  filtersText,
}: FiltersProps): JSX.Element => {
  const { items, refine } = useRefinementList({ attribute: 'brand' })
  const { canRefine: canClear, refine: clear } = useClearRefinements()
  const { items: currentRefinements } = useCurrentRefinements()
  const totalRefinements = currentRefinements.reduce(
    (acc, { refinements }) => acc + refinements.length,
    0
  )

  return (
    <>
      {filtersText && (
        <TouchableOpacity style={styles.filtersButton} onPress={onToggleModal}>
          <Text style={styles.filtersButtonText}>Filters</Text>
          {totalRefinements > 0 && (
            <View style={styles.itemCount}>
              <Text style={styles.itemCountText}>{totalRefinements}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      <Modal animationType='slide' visible={isModalOpen}>
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Brand</Text>
            </View>
            <View style={styles.list}>
              {items.map((item) => {
                return (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      refine(item.value)
                      onChange()
                    }}
                    style={styles.item}
                  >
                    <Text
                      style={{
                        ...styles.labelText,
                        fontWeight: item.isRefined ? '800' : '400',
                      }}
                    >
                      {item.label}
                    </Text>
                    <View style={styles.itemCount}>
                      <Text style={styles.itemCountText}>{item.count}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
          <View style={styles.filterListButtonContainer}>
            <View style={styles.filterListButton}>
              <Button
                onPress={() => {
                  clear()
                  onChange()
                  onToggleModal()
                }}
                title='Clear all'
                color='#252b33'
                disabled={!canClear}
              />
            </View>
            <View style={styles.filterListButton}>
              <Button
                onPress={onToggleModal}
                title='See results'
                color='#252b33'
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#ffffff',
  },
  title: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 32,
  },
  list: {
    marginTop: 32,
  },
  item: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  itemCount: {
    backgroundColor: '#252b33',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  itemCountText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  labelText: {
    fontSize: 16,
  },
  filterListButtonContainer: {
    flexDirection: 'row',
  },
  filterListButton: {
    flex: 1,
    alignItems: 'center',
    marginTop: 18,
  },
  filtersButton: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
})
