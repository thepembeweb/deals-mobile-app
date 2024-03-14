import { supabase } from '../../lib/supabase'
import { type Message, type MessageThread } from '../types/supabase'
import { SELECT_MESSAGE_THREADS_QUERY, SELECT_MESSAGES_QUERY } from './queries'

const getMessages = async (
  messageIdWithChats?: number | undefined
): Promise<Message[]> => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    console.log(sessionError.message)
    return []
  }

  const { data, error } = await supabase
    .from('messages')
    .select(SELECT_MESSAGES_QUERY)
    .eq('user_id', sessionData.session?.user.id)
    .order('created_at', { ascending: false })

  if (error !== null) {
    console.log(error.message)
  }

  const messages = (data as unknown as Message[]) || []

  if (messages && messages.length > 0) {
    const { data: threads, error: selectChatsError } = await supabase
      .from('message_threads')
      .select(SELECT_MESSAGE_THREADS_QUERY)
      .eq('user_id', sessionData.session?.user.id)
      .eq('message_id', messageIdWithChats ?? messages[0].id)
      .order('created_at', { ascending: true })

    if (selectChatsError) {
      console.log(selectChatsError.message)
      return []
    }

    if (messageIdWithChats) {
      const index = messages.findIndex(
        (message) => message.id === messageIdWithChats
      )
      messages[index].threads = (threads as unknown as MessageThread[]) || []
    } else {
      messages[0].threads = (threads as unknown as MessageThread[]) || []
    }
  }

  return messages
}

export default getMessages
