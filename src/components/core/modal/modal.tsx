/* eslint-disable max-len */
import {
  BottomSheetModal,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet'
import * as React from 'react'

import { View } from '../view'
import { renderBackdrop } from './modal-backdrop'
import { ModalHeader } from './modal-header'
import type { ModalProps, ModalRef } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useModal = () => {
  const ref = React.useRef<BottomSheetModal>(null)
  const present = React.useCallback((data?: any) => {
    ref.current?.present(data)
  }, [])
  const dismiss = React.useCallback(() => {
    ref.current?.dismiss()
  }, [])
  return { ref, present, dismiss }
}

// eslint-disable-next-line react/display-name
export const Modal = React.forwardRef(
  (
    {
      snapPoints: _snapPoints = ['60%'],
      title,
      detached = false,
      ...props
    }: ModalProps,
    ref: ModalRef
  ) => {
    const detachedProps = React.useMemo(
      () => getDetachedProps(detached),
      [detached]
    )
    const modal = useModal()
    const snapPoints = React.useMemo(() => _snapPoints, [_snapPoints])

    React.useImperativeHandle(
      ref,
      () => (modal.ref.current as BottomSheetModal) || null
    )

    const renderHandleComponent = React.useCallback(
      () => (
        <>
          <View className='mt-2 h-1 w-12 self-center rounded-lg bg-gray-400 dark:bg-gray-700' />
          <ModalHeader title={title} dismiss={modal.dismiss} />
        </>
      ),
      [title, modal.dismiss]
    )

    return (
      <BottomSheetModal
        {...props}
        {...detachedProps}
        ref={modal.ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={props.backdropComponent ?? renderBackdrop}
        handleComponent={renderHandleComponent}
      />
    )
  }
)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getDetachedProps = (detached: boolean) => {
  if (detached) {
    return {
      detached: true,
      bottomInset: 46,
      style: { marginHorizontal: 16, overflow: 'hidden' },
    } as Partial<BottomSheetModalProps>
  }
  return {} as Partial<BottomSheetModalProps>
}
