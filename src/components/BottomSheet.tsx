import { Ionicons } from '@expo/vector-icons'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import React, { forwardRef, useCallback, useMemo } from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import colors from '../theme/colors'

export type Ref = BottomSheetModal

// eslint-disable-next-line react/display-name
const BottomSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['50%'], [])
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  )
  const { dismiss } = useBottomSheetModal()

  return (
    <BottomSheetModal
      handleIndicatorStyle={{ display: 'none' }}
      backgroundStyle={{ borderRadius: 0, backgroundColor: colors.lightGrey }}
      overDragResistanceFactor={0}
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.contentContainer}>
        <View style={styles.toggle}>
          <TouchableOpacity style={styles.toggleActive}>
            <Text style={styles.activeText}>Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleInactive}>
            <Text style={styles.inactiveText}>Pickup</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subheader}>Your Location</Text>
        <Link href={'/(tabs)/home/location-search'} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Ionicons
                name='location-outline'
                size={20}
                color={colors.medium}
              />
              <Text style={{ flex: 1 }}>Current location</Text>
              <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
            </View>
          </TouchableOpacity>
        </Link>

        <Text style={styles.subheader}>Arrival time</Text>
        <TouchableOpacity>
          <View style={styles.item}>
            <Ionicons
              name='stopwatch-outline'
              size={20}
              color={colors.medium}
            />
            <Text style={{ flex: 1 }}>Now</Text>
            <Ionicons name='chevron-forward' size={20} color={'#20E1B2'} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => dismiss()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  )
})

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  toggleActive: {
    backgroundColor: '#20E1B2',
    padding: 8,
    borderRadius: 32,
    paddingHorizontal: 30,
  },
  activeText: {
    color: '#fff',
    fontWeight: '700',
  },
  toggleInactive: {
    padding: 8,
    borderRadius: 32,
    paddingHorizontal: 30,
  },
  inactiveText: {
    color: '#20E1B2',
  },
  button: {
    backgroundColor: '#20E1B2',
    padding: 16,
    margin: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 16,
    fontWeight: '600',
    margin: 16,
  },
  item: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderColor: colors.grey,
    borderWidth: 1,
  },
})

export default BottomSheet
