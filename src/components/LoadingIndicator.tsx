import React from 'react'
import { ActivityIndicator, View, type ViewProps } from 'react-native'

type LoadingIndicatorProps = ViewProps & {
  size?: 'small' | 'large'
  color?: string
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  color = '#0000ff',
  ...props
}) => {
  return (
    <View className='flex-1 flex justify-center items-center'>
      <ActivityIndicator {...props} />
    </View>
  )
}

export default LoadingIndicator
