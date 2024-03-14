import { formatDistanceToNow } from 'date-fns'
import { Text } from 'react-native'

interface TimeAgoProps {
  date: Date
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date }) => {
  const timeAgo = formatDistanceToNow(date, { addSuffix: true })
  return <Text>{timeAgo}</Text>
}

export default TimeAgo
