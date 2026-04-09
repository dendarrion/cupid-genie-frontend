// src/composables/useActionCable.js
import { ref, onUnmounted } from 'vue'
import { createConsumer } from '@rails/actioncable'

export function useActionCable() {
  const cable = ref(null)
  const subscription = ref(null)
  const isConnected = ref(false)

  const connect = (token) => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/cable'
    cable.value = createConsumer(`${wsUrl}?token=${token}`)
    isConnected.value = true
  }

  const subscribe = (channelName, params, callbacks) => {
    if (!cable.value) {
      console.error('Cable not connected')
      return
    }

    subscription.value = cable.value.subscriptions.create(
      { channel: channelName, ...params },
      {
        connected() {
          console.log(`Connected to ${channelName}`)
          callbacks.connected?.()
        },
        disconnected() {
          console.log(`Disconnected from ${channelName}`)
          callbacks.disconnected?.()
        },
        received(data) {
          callbacks.received?.(data)
        }
      }
    )

    return subscription.value
  }

  const unsubscribe = () => {
    if (subscription.value) {
      subscription.value.unsubscribe()
      subscription.value = null
    }
  }

  const disconnect = () => {
    if (cable.value) {
      cable.value.disconnect()
      cable.value = null
      isConnected.value = false
    }
  }

  onUnmounted(() => {
    unsubscribe()
    disconnect()
  })

  return {
    connect,
    subscribe,
    unsubscribe,
    disconnect,
    subscription,
    isConnected
  }
}