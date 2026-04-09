<script setup>
import { useRouter } from 'vue-router'
const props = defineProps(['user1', 'user2'])
const emit = defineEmits(['close'])
const emitClose = () => emit('close')

const router = useRouter()
const sendMessage = () => {
  emitClose()
  router.push(`/inbox/chat/${props.user2.id}`)
}
</script>

<template>
  <div class="fixed inset-0 z-[200] bg-pink-300/90 dark:bg-pink-600/90 flex items-center justify-center" @click.self="emitClose">
    <div class="bg-white rounded-2xl p-6 w-[calc(100vw-4rem)] max-w-md text-center flex flex-col gap-2 shadow-xl relative">
      <div class="relative h-30 flex items-center justify-center mb-6">
        <img :src="user1.profilePicture" :alt="'Picture of ' + user1.fullName"
          class="w-32 h-44 object-cover rounded-xl shadow-md absolute transform -rotate-[14deg] left-1/2 -translate-x-[90%] z-10" />
        <img :src="user2.profilePicture" :alt="'Picture of ' + user2.fullName"
          class="w-32 h-44 object-cover rounded-xl shadow-lg absolute transform rotate-[14deg] left-1/2 -translate-x-[20%] z-20" />
        <div class="absolute z-30 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
          <svg class="animate-ping w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold">It's a <span class="text-pink-500">match</span>!</h2>

      <p class="font-semibold mb-4">
        You and {{ user2.firstName }} liked each other
      </p>

      <button @click="sendMessage"
      class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
        Start messaging
      </button>

      <button @click="emitClose" class="block text-gray-400">Close</button>
    </div>
  </div>
</template>