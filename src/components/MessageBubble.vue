<script setup>
import { computed } from 'vue'
const props = defineProps({
  msg: { type: Object, required: true },
  currentUser: { type: Object, required: true }
})

const isSelf = computed(() => String(props.msg.sender.id) === String(props.currentUser.id))
const classes = computed(() => {
  return {
    alignment: isSelf.value ? 'items-end' : 'items-start',
    color: isSelf.value
      ? props.currentUser.gender === 'female'
        ? 'bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-100'
        : 'bg-blue-400 dark:bg-blue-600 text-gray-100 dark:text-gray-300'
      : props.currentUser.gender === 'female'
        ? 'bg-blue-400 dark:bg-blue-600 text-gray-100 dark:text-gray-300'
        : 'bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-100'
  }
})
</script>

<template>
  <div :id="'message-'+msg.id" :class="['flex flex-col', classes.alignment]" :title="msg.timeSent">
    <div data-testid="message-bubble" :class="['px-4 py-2 rounded-lg wrap-break-word', classes.color]">
      {{ msg.content }}
    </div>
  </div>
</template>
