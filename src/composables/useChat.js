import { ref, nextTick, computed } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useChatStore } from '@/stores/chat'
import GET_MESSAGES from '@/graphql/queries/get_messages.gql'
import SEND_MESSAGE from '@/graphql/mutations/send_message.gql'

const formatDateLabel = (isoString) => {
  const date = new Date(isoString)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const isDifferentDay = (a, b) => {
  if (!a || !b) return true
  return new Date(a).toDateString() !== new Date(b).toDateString()
}

export function useChat(selectedMatch, messageInput) {
  const chatStore = useChatStore()
  const convoId = computed(() => selectedMatch.value?.conversationId)
  const messages = computed(() => chatStore.messagesByConversation[convoId.value] || [])
  const messageText = ref('')

  const { result: messagesResult, loading: messagesLoading, onResult, refetch } = useQuery(
    GET_MESSAGES,
    () => ({ conversationId: convoId.value }),
    () => ({ enabled: !!convoId.value, fetchPolicy: 'network-only' })
  ) 
  onResult((messagesResult) => {
    if (!messagesResult?.data?.messages || !convoId.value) return
    messagesResult.data.messages.forEach(msg => chatStore.addMessage(convoId.value, msg))
  })

  const { mutate: sendMessageMutation } = useMutation(SEND_MESSAGE)

  const sendMessage = async () => {
    const content = messageText.value.trim()
    if (!content) return
    
    messageText.value = ''
    await nextTick()
    messageInput.value?.focus()

    const input = { matchId: selectedMatch.value.matchId, content }

    try {
      const { data } = await sendMessageMutation(input)
      const convo = data?.sendMessage?.conversation || false
      const message = data?.sendMessage?.message || false
      if (convo && message) {        
        chatStore.addMessage(convo.id, message)
        if (!selectedMatch.value.conversationId) {
          selectedMatch.value.conversationId = convo.id
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const renderedMessages = computed(() => {
    if (!messages.value) return []

    return messages.value.map((msg, index) => {
      const prev = messages.value[index - 1]
      const showDateSeparator = isDifferentDay(msg.createdAt, prev?.createdAt)
      const dateLabel = showDateSeparator ? formatDateLabel(msg.createdAt) : null
      return {
        id: msg.id,
        message: msg,
        prevMessage: prev || null,
        showDateSeparator: showDateSeparator,
        dateLabel: dateLabel
      }
    })
  })

  return { renderedMessages, messagesLoading, messageText, sendMessage, refetch }
}
