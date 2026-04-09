import { ref } from "vue"
import { useChatStore } from "@/stores/chat"

export function useActionCableChat(conversationId, isConnected, subscribe, unsubscribe) {
  const chatStore = useChatStore()
  const subscription = ref(null)

  const subscribeToConversation = (id) => {
    if (!id || !isConnected.value) return
    if (subscription.value) {
      subscription.value.unsubscribe()
      subscription.value = null
    }

    const sub = subscribe(
      'ConversationChannel',
      { conversation_id: id },
      {
        received(data) {
          if (!data?.id) return

          chatStore.addMessage(id, {
            id: data.id,
            content: data.content,
            sender: data.sender,
            timeSent: data.timeSent,
            createdAt: data.createdAt,
          })
        }
      }
    )
    subscription.value = sub
  }

  return { subscribeToConversation }
}
