/* eslint-disable max-len */
import {
  type BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet'
import * as React from 'react'

import { Modal, useModal } from './modal'
import type { DynamicModalProps, ModalRef } from './types'

// eslint-disable-next-line react/display-name
export const DynamicModal = React.forwardRef(
  (
    { snapPoints = ['CONTENT_HEIGHT'], children, ...props }: DynamicModalProps,
    ref: ModalRef
  ) => {
    const modal = useModal()
    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(snapPoints) // cast to remove shared values type

    React.useImperativeHandle(
      ref,
      () => (modal.ref.current as BottomSheetModal) || null
    )

    return (
      <Modal
        {...props}
        ref={modal.ref}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          {children}
        </BottomSheetView>
      </Modal>
    )
  }
)
