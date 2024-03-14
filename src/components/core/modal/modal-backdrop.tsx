import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import React from 'react'

export const renderBackdrop = (
  props: BottomSheetBackdropProps
): JSX.Element => (
  <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
)
