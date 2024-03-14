import { useEffect, useState } from 'react'

import { getItem, setItem } from '../../lib/storage'
import { IS_FIRST_TIME_USER } from '../utils/constants'

export const useIsFirstTimeUser = (): [
  boolean,
  (isFirstTimeUser: boolean) => void,
] => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true)

  useEffect(() => {
    const checkIsFirstTimeUser = async (): Promise<void> => {
      const isFirstTime = await getItem<boolean>(IS_FIRST_TIME_USER)
      if (isFirstTime === false) {
        setIsFirstTimeUser(false)
      } else {
        await setItem<boolean>(IS_FIRST_TIME_USER, true)
      }
    }

    void checkIsFirstTimeUser()
  }, [])

  return [isFirstTimeUser, setIsFirstTimeUser]
}
