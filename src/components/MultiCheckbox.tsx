import React, { useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

import { type SelectOption } from '../components/core'
import { FlashList } from '@shopify/flash-list'

interface MultiCheckboxProps {
  options: SelectOption[]
}

const MultiCheckbox: React.FC<MultiCheckboxProps> = ({ options }) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([])

  const toggleSelection = (option: SelectOption): void => {
    if (selectedOptions.some((s) => s.value === option.value)) {
      setSelectedOptions(
        selectedOptions.filter((item) => item.value !== option.value)
      )
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const renderItem = ({ item: option }): JSX.Element => (
    <TouchableOpacity
      key={option.value}
      onPress={() => {
        toggleSelection(option)
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
      }}
    >
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#000',
          marginRight: 10,
          backgroundColor: selectedOptions.some((s) => s.value === option.value)
            ? 'blue'
            : 'transparent',
        }}
      />
      <Text>{option.label}</Text>
    </TouchableOpacity>
  )

  return (
    // <View
    //   style={{
    //     flex: 1,
    //     padding: 24,
    //     flexGrow: 1,
    //     minHeight: 2,
    //   }}
    // >
    <View style={{ flexGrow: 1, flexDirection: 'row', minHeight: 2 }}>
      {/* <FlatList
        ListHeaderComponent={
          <View style={{ flex: 1 }}>
            <Text>Header content</Text>
          </View>
        }
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.value.toString()}
        ListFooterComponent={
          <Text>Take a look at the list of recipes below:</Text>
        }
      /> */}

      <FlashList
        data={options}
        keyExtractor={(item) => item.value.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps='always'
        estimatedItemSize={61}
      ></FlashList>
    </View>
  )

  //   return (
  //     <View>
  //       {options.map((option) => (
  //         <TouchableOpacity
  //           key={option.value}
  //           onPress={() => {
  //             toggleSelection(option)
  //           }}
  //           style={{
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             marginVertical: 5,
  //           }}
  //         >
  //           <View
  //             style={{
  //               height: 20,
  //               width: 20,
  //               borderRadius: 5,
  //               borderWidth: 1,
  //               borderColor: '#000',
  //               marginRight: 10,
  //               backgroundColor: selectedOptions.some(
  //                 (s) => s.value === option.value
  //               )
  //                 ? 'blue'
  //                 : 'transparent',
  //             }}
  //           />
  //           <Text>{option.label}</Text>
  //         </TouchableOpacity>
  //       ))}
  //     </View>
  //   )
}

export default MultiCheckbox
