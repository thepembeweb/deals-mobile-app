import AsyncStorage from '@react-native-async-storage/async-storage'

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Error getting item from AsyncStorage:', error)
    return null
  }
}

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting item in AsyncStorage:', error)
  }
}

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing item from AsyncStorage:', error)
  }
}
