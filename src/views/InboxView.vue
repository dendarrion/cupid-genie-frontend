<script setup>
import { ref, watch, computed, onBeforeUnmount, onMounted, render, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { useQuery } from '@vue/apollo-composable'
import { useChat } from '@/composables/useChat'
import { useActionCable } from '@/composables/useActionCable'
import { useActionCableChat } from '@/composables/useActionCableChat'

import QUERY_MATCHED from '@/graphql/queries/get_matched.gql'
import MessageBubble from '@/components/MessageBubble.vue'
import MessageMatchItem from '@/components/MessageMatchItem.vue'
import ActionButton from '@/components/ActionButton.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const { connect, subscribe, unsubscribe, disconnect, isConnected } = useActionCable()

const messageInput = ref(null)
const selectedMatch = ref(null)

const currentUserId = computed(() => authStore.current_user?.id)
const convoId = computed(() => selectedMatch.value?.conversationId)

const { result: matchesResult, loading: matchesLoading, error: matchesError } = useQuery(
  QUERY_MATCHED,
  { id: currentUserId.value },
  { fetchPolicy: 'cache-and-network', enabled: !!currentUserId.value }
)

const matches = computed(() => {
  if (!matchesResult.value?.matchedUsers) return []

  return matchesResult.value.matchedUsers.map(match => {
    const cid = match.conversation?.id
    const convoMessages = cid ? chatStore.messagesByConversation[cid] || [] : []
    const lastMsg = convoMessages.length ? convoMessages[convoMessages.length - 1] : match.conversation?.lastMessage

    return {
      id: match.otherUser.id,
      matchId: match.id,
      conversationId: cid || null,
      fullName: match.otherUser.fullName,
      thumbnail: match.otherUser.profilePicture,
      lastMessage: lastMsg || null
    }
  })
})

const matchesMap = computed(() => new Map(matches.value.map(m => [m.id, m])))
const selectMatchById = (id) => {
  const match = matchesMap.value.get(id)
  if (match) selectedMatch.value = match
}

const { renderedMessages, messagesLoading, messageText, sendMessage } = useChat(selectedMatch, messageInput)
const { subscribeToConversation } = useActionCableChat(convoId, isConnected, subscribe, unsubscribe)

const showScrollButton = ref(false)
const messagesContainer = ref(null)
const lastScrollTop = ref(0)
const scrollToMessage = async (msgId = null) => {
  await nextTick()
  const el = messagesContainer.value
  if (!el) return
  
  if (msgId) {
    const msgEl = document.getElementById(`message-${msgId}`)
    if (msgEl) {
      msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      lastScrollTop.value = el.scrollTop
      return
    }
  }
  el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
}
const handleScroll = () => {
  const el = messagesContainer.value
  if (!el) return

  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
  showScrollButton.value = distanceFromBottom > 200
  lastScrollTop.value = el.scrollTop
}

const focusInput = (match) => {
  if (!match) return
  messageInput.value?.focus()
  router.push(`/inbox/chat/${match.id}`)
}

onMounted(() => {
  if (authStore.token) connect(authStore.token)
})

watch(
  [matches, () => route.params.userId],
  ([newMatches, uid]) => {
    if (!newMatches.length) return
    if (uid) {
      selectMatchById(uid)
    } else if (!selectedMatch.value) {
      const match = newMatches.find(m => String(m.id) === String(uid))
      selectedMatch.value = match || newMatches[0]
      return
    }
  }, { immediate: true }
)

watch([convoId, isConnected], ([cid, connected]) => {
  if (!cid || !connected) return
  subscribeToConversation(convoId.value)
}, { immediate: true })

watch(selectedMatch,
  (match) => {
    const lastUserMsg = renderedMessages.value.slice().reverse().find(m => m.message.sender.id === currentUserId.value)
    console.log('last message: ', lastUserMsg);

    scrollToMessage(lastUserMsg?.id)
    focusInput(match)

    // After selecting a conversation decide if the scroll button is needed
    nextTick().then(() => {
      const el = messagesContainer.value
      if (!el) {
        showScrollButton.value = false
        return
      }
      const overflowAmount = el.scrollHeight - el.clientHeight
      showScrollButton.value = overflowAmount > 200
    })
  },
  { immediate: true })

// Auto-scroll new messages only when the user is near the bottom; otherwise show the Scroll button
watch(renderedMessages, (newVal, oldVal) => {
  nextTick().then(() => {
    const el = messagesContainer.value
    if (!el) return

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    const nearBottom = distanceFromBottom < 200

    if (nearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      showScrollButton.value = false
    } else {
      showScrollButton.value = true
    }
  })
}, { deep: false })

onBeforeUnmount(() => {
  unsubscribe()
  disconnect()
})
</script>

<template>
  <div class="flex h-[calc(100vh-4rem)] bg-gray-200 dark:bg-gray-900 dark:text-white gap-1">
    <div class="h-full w-full md:w-1/3 overflow-y-auto" :class="selectedMatch ? 'hidden md:block' : 'block'">
      <div v-if="matchesLoading" class="p-4 text-center text-gray-500">Loading matches...</div>
      <div v-else-if="matchesError" class="p-4 text-center text-red-500">Error: {{ matchesError.message }}</div>
      <div v-else-if="matches.length === 0" class="p-4 text-center text-gray-500">No matches yet. Start swiping!</div>

      <template v-else>
        <div class="h-full flex flex-col gap-1 ms-1">
          <div>
            <input type="text" placeholder="Search"
              class="mt-1 flex-1 w-full h-14 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 outline-none">
          </div>
          <div class="flex-1 bg-gray-50 dark:bg-gray-600 rounded-t-2xl">
            <div class="p-4">
              <h1 class="text-black dark:text-gray-50 text-2xl font-medium">Messages</h1>
            </div>
            <MessageMatchItem v-for="match in matches" :key="match.id" :match="match"
              :selected="selectedMatch?.id === match.id" @select="selectedMatch = $event" />
          </div>
        </div>
      </template>
    </div>

    <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 w-full md:w-2/3 flex flex-col"
      :class="selectedMatch ? 'block' : 'hidden md:flex'">
      <template v-if="selectedMatch">
        <div class="bg-white dark:bg-gray-900 h-16 px-4 flex items-center gap-3">
          <button class="md:hidden text-white text-lg" @click="selectedMatch = null">←</button>
          <img :src="selectedMatch.thumbnail" alt="profile" class="w-10 h-10 rounded-full object-cover" />
          <p class="font-semibold truncate">{{ selectedMatch.fullName }}</p>
        </div>

        <div data-testid="messages-container" id="messages-container" ref="messagesContainer" @scroll="handleScroll"
          class="bg-gray-200 dark:bg-gray-800 flex-1 flex flex-col overflow-y-auto p-4 rounded-t-3xl">

          <div class="flex flex-col gap-4 mt-auto w-full">
            <div v-if="messagesLoading" class="text-center text-gray-500">Loading messages...</div>
            <div v-else-if="!renderedMessages.length" class="text-center text-gray-500">No messages yet. Start the
              conversation!</div>

            <div v-else v-for="item in renderedMessages" :key="item.id">
              <div v-if="item.showDateSeparator" class="flex justify-center my-4">
                <span
                  class="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                  {{ item.dateLabel }}
                </span>
              </div>
              <MessageBubble :msg="item.message" :prevMsg="item.prevMessage" :currentUser="authStore.current_user" />
            </div>
          </div>

        </div>

        <div class="p-3 max-w-full bg-gray-200 dark:bg-gray-800">
          <div v-if="showScrollButton" class="flex justify-center mb-4">
            <ActionButton @click="scrollToMessage" color="bg-blue-400" icon="arrow_down" label="Scroll" testId="scroll-bottom-btn" />
          </div>
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input placeholder="Type a message..."
              ref="messageInput" v-model="messageText" data-testid="message-input"
              class="flex-1 min-w-0 h-14 bg-white dark:bg-gray-900 rounded-full px-4 py-2 outline-none" />
            <button type="submit" :disabled="!messageText.trim()"
              data-testid="send-message-btn"
              class="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      </template>

      <div v-else class="hidden md:flex flex-1 items-center justify-center text-gray-500">
        <p>Select a conversation to start chatting</p>
      </div>
    </div>
  </div>
</template>
