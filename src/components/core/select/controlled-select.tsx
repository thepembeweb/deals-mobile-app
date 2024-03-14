import * as React from 'react'
import { type FieldValues, useController } from 'react-hook-form'

import type { InputControllerType } from '../input'
import { Select, type SelectProps } from './select'

interface ControlledSelectProps<T extends FieldValues>
  extends SelectProps,
    InputControllerType<T> {}

// only used with react-hook-form
export const ControlledSelect = <T extends FieldValues>(
  props: ControlledSelectProps<T>
): JSX.Element => {
  const { name, control, rules, ...selectProps } = props

  const { field, fieldState } = useController({ control, name, rules })
  return (
    <Select
      onSelect={field.onChange}
      value={field.value}
      error={fieldState.error?.message}
      {...selectProps}
    />
  )
}
