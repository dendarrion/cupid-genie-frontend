<script setup>
const props = defineProps({
  match: { type: Object, required: true },
  selected: { type: Boolean, default: false }
})
const emit = defineEmits(['select'])
</script>

<template>
  <div
  :data-testid="`message-match-item-${match.id}`"
  @click="$emit('select', match)" 
  :class="[
    'h-16 px-4 cursor-pointer flex items-center gap-3 dark:text-gray-200',
    selected ? 'bg-black dark:bg-gray-500 text-gray-100 dark:text-gray-200' : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:hover:text-gray-200'
  ]">
    <img :src="match.thumbnail" alt="profile" class="w-10 h-10 rounded-full object-cover" />
    <div class="flex-1 min-w-0">
      <p class="font-medium truncate leading-tight">{{ match.fullName }}</p>
      <p class="text-sm truncate">
        {{ match.lastMessage?.content || 'No messages yet.' }}
      </p>
    </div>
  </div>
</template>
