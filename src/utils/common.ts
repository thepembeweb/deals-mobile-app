import { compareAsc, format, parse } from 'date-fns'
import { type LocationGeocodedAddress } from 'expo-location'
import { Alert } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import * as Sentry from 'sentry-expo'

/* eslint-disable max-len */
export function formatImageSrc(src: string, folder: string): string {
  if (src.startsWith('http')) {
    return src
  }
  return `https://bwrpgxjlezbpsugccrez.supabase.co/storage/v1/object/public/${folder}/${src}`
}

export function formatToOneDecimalPlace(number: number): string {
  if (!isNumber(number)) return '0'
  return number.toFixed(1)
}

export function isNumber(value: string | number): boolean {
  return (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    !Number.isNaN(Number(value.toString()))
  )
}

export function numericFormatter(
  value: number,
  maximumFractionDigits: number = 0,
  minimumFractionDigits: number = 0
): string {
  if (!isNumber(value)) return ''
  const inrFormat = new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits,
  })
  return inrFormat.format(value)
}

// A function to log the error - could be to a logging service or console
export function logError(error: unknown, scope?: unknown): void {
  // In a real-world application, you might want to send this to a remote logging service.
  // console.error('An error occurred:', error)

  if (scope) {
    Sentry.Native.captureException(error, scope)
  } else {
    Sentry.Native.captureException(error)
  }
}

export function handleError(
  error: unknown,
  userFriendlyMessage: string = 'An unexpected error occurred',
  scope?: unknown
): void {
  console.error(userFriendlyMessage, error)

  if (scope) {
    logError(error, scope)
  } else {
    logError(error)
  }
  if (error instanceof Error) {
    // Here you can add more specific checks, like if (error.name === 'SpecificError') { ... }
    // to handle different types of errors differently.
    Alert.alert(userFriendlyMessage, error.message)
  } else if (typeof error === 'string') {
    Alert.alert(userFriendlyMessage, error)
  } else {
    Alert.alert(userFriendlyMessage)
  }
}

export function formatDate(date: Date): string {
  const formattedDate = format(date, 'MMM dd, yyyy')

  return formattedDate
}

export function parseFormattedDate(
  dateString: string,
  dateFormat: string = 'yyyy/MM/dd'
): Date {
  const parsedDate = parse(dateString, dateFormat, new Date())

  return parsedDate
}

export const showErrorMessage = (
  message: string = 'Something went wrong '
): void => {
  showMessage({
    message,
    type: 'danger',
    duration: 4000,
  })
}

export const extractError = (data: unknown): string => {
  if (typeof data === 'string') {
    return data
  }
  if (Array.isArray(data)) {
    const messages = data.map((item) => {
      return `  ${extractError(item)}`
    })

    return `${messages.join('')}`
  }

  if (typeof data === 'object' && data !== null) {
    const messages = Object.entries(data).map((item) => {
      const [key, value] = item
      const separator = Array.isArray(value) ? ':\n ' : ': '

      return `- ${key}${separator}${extractError(value)} \n `
    })
    return `${messages.join('')} `
  }
  return 'Something went wrong '
}

export const getAddressDescription = (
  address: LocationGeocodedAddress
): string => {
  const { name, district, city, postalCode, country } = address

  return [name, district, postalCode, city, country].filter(Boolean).join(', ')
}

export function isDate2GreaterThanDate1(date1: Date, date2: Date): boolean {
  return compareAsc(date1, date2) < 0
}
