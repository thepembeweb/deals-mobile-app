import * as React from 'react'
import {
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useController,
} from 'react-hook-form'

import { Input, type NInputProps } from './input'

type TRule = Omit<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>

export type RuleType<T> = { [name in keyof T]: TRule }
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  rules?: TRule
}

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

// only used with react-hook-form
export const ControlledInput = <T extends FieldValues>(
  props: ControlledInputProps<T>
): JSX.Element => {
  const { name, control, rules, ...inputProps } = props

  const { field, fieldState } = useController({ control, name, rules })
  return (
    <Input
      ref={field.ref}
      autoCapitalize='none'
      onChangeText={field.onChange}
      value={field.value as string}
      {...inputProps}
      error={fieldState.error?.message}
    />
  )
}
