import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messagesByConversation: reactive({}),
  }),

  actions: {
    addMessage(convoId, message) {
      if (!convoId || !message) return
      const list = this.messagesByConversation[convoId] || []
      if (list.some(msg => String(msg.id) === String(message.id))) return

      list.push({
        ...message,
        createdAt: message.createdAt || message.timeSent || new Date().toISOString()
      })
      this.messagesByConversation[convoId] = list
    },
    clear() {
      this.messagesByConversation = {}
    }
  }
})