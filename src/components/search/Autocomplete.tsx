/* eslint-disable max-len */
import { Entypo, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { useSearchBox, type UseSearchBoxProps } from 'react-instantsearch-core'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { Suggestions } from './Suggestions'

type AutocompleteProps = UseSearchBoxProps & {
  onChange: (newValue: string) => void
  onToggleFilters: () => void
  suggestionsIndexName?: string
}

export const Autocomplete = ({
  onChange,
  onToggleFilters,
  suggestionsIndexName,
  ...props
}: AutocompleteProps): JSX.Element => {
  const router = useRouter()
  const { query, refine } = useSearchBox(props)
  const [inputValue, setInputValue] = useState(query)
  const inputRef = useRef<TextInput>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  function setQuery(newQuery: string): void {
    setInputValue(newQuery)
    refine(newQuery)
  }

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query)
  }

  const handleSearchChange = (text: string): void => {
    setQuery(text)
    onChange(text)
  }

  const handleSearchSubmit = (): void => {
    if (onChange) {
      onChange(query)
    }
  }

  return (
    <>
      <View className='flex-row items-center space-x-2 px-4 py-2 '>
        <View>
          <TouchableOpacity
            onPress={() => {
              // navigation.goBack();
              router.replace('/home')
            }}
            className='py-2 rounded-full bg-white'
          >
            <Entypo
              name='chevron-left'
              size={hp(4.5)}
              strokeWidth={4.5}
              color='#fbbf24'
            />
          </TouchableOpacity>
        </View>
        <View className='flex-row flex-1 items-center p-3 rounded-full border border-gray-300'>
          <Feather name='search' size={25} color='gray' />
          <TextInput
            ref={inputRef}
            className='ml-2 flex-1'
            keyboardType='default'
            // style={styles.input}
            // className="ml-2 flex-1 h-auto p-3"
            value={inputValue}
            onBlur={() =>
              setTimeout(() => {
                setShowSuggestions(false)
              }, 100)
            }
            onChangeText={handleSearchChange}
            onFocus={() => {
              setShowSuggestions(true)
            }}
            clearButtonMode='always'
            autoCapitalize='none'
            autoCorrect={false}
            spellCheck={false}
            autoComplete='off'
            placeholder='Search1 for deals...'
            returnKeyType='search'
            onSubmitEditing={handleSearchSubmit}
          />
        </View>
        <View
          style={{ backgroundColor: 'rgba(30, 41, 59, 1)' }}
          className='p-3 rounded-full'
        >
          <TouchableOpacity onPress={onToggleFilters}>
            <Feather name='sliders' size={20} color='white' strokeWidth='2.5' />
          </TouchableOpacity>
        </View>
      </View>
      {showSuggestions && suggestionsIndexName && (
        <Suggestions
          indexName={suggestionsIndexName}
          onSelect={(value) => {
            setQuery(value)
            inputRef.current?.blur()
          }}
        />
      )}
    </>
  )
}
