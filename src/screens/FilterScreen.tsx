/* eslint-disable no-param-reassign */
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Button,
  FlatList,
  type ListRenderItem,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { type SelectOption } from '../components/core'
import colors from '../theme/colors'

const categories = [
  {
    name: 'Acai',
    count: 7,
  },
  {
    name: 'African',
    count: 9,
  },
  {
    name: 'Alcohol',
    count: 330,
  },
  {
    name: 'American',
    count: 201,
  },
  {
    name: 'BBQ',
    count: 73,
  },
  {
    name: 'Brunch',
    count: 118,
  },
  {
    name: 'Cakes',
    count: 36,
  },
  {
    name: 'Dessert',
    count: 282,
  },
  {
    name: 'Falafel',
    count: 30,
  },
  {
    name: 'German',
    count: 5,
  },
  {
    name: 'Healthy',
    count: 247,
  },
  {
    name: 'Indian',
    count: 112,
  },
  {
    name: 'Meal Deal',
    count: 129,
  },
  {
    name: 'Pancakes',
    count: 15,
  },
  {
    name: 'Pizza',
    count: 208,
  },
  {
    name: 'Soup',
    count: 8,
  },
  {
    name: 'Takeaways',
    count: 87,
  },
  {
    name: 'Wraps',
    count: 99,
  },
]

// interface Category {
//   name: string
//   count: number
//   checked?: boolean
// }

interface ListItem {
  name: string
  value: string | number
  checked?: boolean
}

const ItemBox = (): JSX.Element => (
  <>
    {/* <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item}>
        <Ionicons name='arrow-down-outline' size={20} color={colors.medium} />
        <Text style={{ flex: 1 }}>Sort</Text>
        <Ionicons name='chevron-forward' size={22} color={'#20E1B2'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Ionicons name='fast-food-outline' size={20} color={colors.medium} />
        <Text style={{ flex: 1 }}>Hygiene rating</Text>
        <Ionicons name='chevron-forward' size={22} color={'#20E1B2'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Ionicons name='pricetag-outline' size={20} color={colors.medium} />
        <Text style={{ flex: 1 }}>Offers</Text>
        <Ionicons name='chevron-forward' size={22} color={'#20E1B2'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Ionicons name='nutrition-outline' size={20} color={colors.medium} />
        <Text style={{ flex: 1 }}>Dietary</Text>
        <Ionicons name='chevron-forward' size={22} color={'#20E1B2'} />
      </TouchableOpacity>
    </View> */}
    <Text style={styles.header}>Categories</Text>
  </>
)

const FilterScreen = (): JSX.Element => {
  const params = useLocalSearchParams()
  const { heading, options } = params
  const navigation = useNavigation()
  const [items, setItems] = useState<ListItem[]>([])
  const [selected, setSelected] = useState<ListItem[]>([])
  const flexWidth = useSharedValue(0)
  const scale = useSharedValue(0)

  useEffect(() => {
    const results: SelectOption[] = JSON.parse(String(options))

    const currentItems = results.map((option) => ({
      name: option.label,
      value: option.value,
      checked: false,
    }))

    console.log(currentItems)

    setItems(currentItems)
  }, [options])

  useEffect(() => {
    const hasSelected = selected.length > 0
    const selectedItems = items.filter((item) => item.checked)
    const newSelected = selectedItems.length > 0

    if (hasSelected !== newSelected) {
      flexWidth.value = withTiming(newSelected ? 150 : 0)
      scale.value = withTiming(newSelected ? 1 : 0)
    }

    setSelected(selectedItems)
  }, [items])

  const handleClearAll = (): void => {
    const updatedItems = items.map((item) => {
      item.checked = false
      return item
    })
    setItems(updatedItems)
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: flexWidth.value,
      opacity: flexWidth.value > 0 ? 1 : 0,
    }
  })

  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const renderItem: ListRenderItem<ListItem> = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.itemText}>{item.name}</Text>
      <BouncyCheckbox
        isChecked={items[index].checked}
        fillColor={'#20E1B2'}
        unfillColor='#fff'
        disableBuiltInState
        iconStyle={{
          borderColor: '#20E1B2',
          borderRadius: 4,
          borderWidth: 2,
        }}
        innerIconStyle={{ borderColor: '#20E1B2', borderRadius: 4 }}
        onPress={() => {
          const isChecked = items[index].checked

          const updatedItems = items.map((item) => {
            if (item.name === items[index].name) {
              item.checked = !isChecked
            }

            return item
          })

          setItems(updatedItems)
        }}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.header}>{heading}</Text>}
      />
      <View style={{ height: 76 }} />
      <View style={styles.footer}>
        <View style={styles.btnContainer}>
          <Animated.View style={[animatedStyles, styles.outlineButton]}>
            <TouchableOpacity onPress={handleClearAll}>
              <Animated.Text style={[animatedText, styles.outlineButtonText]}>
                Clear all
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.fullButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.footerText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.lightGrey,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: -10,
    },
  },
  fullButton: {
    backgroundColor: '#20E1B2',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    height: 56,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderColor: colors.grey,
    borderBottomWidth: 1,
  },
  itemText: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  outlineButton: {
    borderColor: '#20E1B2',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 56,
  },
  outlineButtonText: {
    color: '#20E1B2',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default FilterScreen
