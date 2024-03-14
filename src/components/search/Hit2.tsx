import { type Hit as AlgoliaHit } from '@algolia/client-search'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

interface Hit2Props {
  hit: AlgoliaHit<{
    title: string
    price: number
    actual_price: number
    discount_percent: number
    image: string
    popularity: number
    rating: number
    categories: string[]
  }>
}

const Hit2 = ({ hit }: Hit2Props): JSX.Element => {
  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://picsum.photos/300',
          }}
          style={styles.image}
        />
      </View>

      {/* <Image
        resizeMethod='resize'
        style={{
          width: '100%',
          height: undefined,
          aspectRatio: 1,
        }}
        source={{
          uri: 'https://picsum.photos/300',
        }}
      /> */}
      <Text
        style={styles.singleLineText}
        numberOfLines={1} // Keep text to one line
        ellipsizeMode='tail'
      >
        {hit.title.length > 15 ? hit.title.slice(0, 15) + '...' : hit.title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  singleLineText: {
    width: '100%',
    paddingVertical: 5,
    fontSize: 14,
  },
  imageContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: { width: '100%', height: undefined, aspectRatio: 1 },
  nameText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 15,
  },
})
export default Hit2
