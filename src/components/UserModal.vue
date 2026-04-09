<script setup>
import { reactive, watch } from 'vue'

const props = defineProps(['user', 'editable'])
const emit = defineEmits(['close', 'update'])
const editedUser = reactive({ ...props.user })

watch(() => props.user,
  (newUser) => Object.assign(editedUser, newUser),
  { deep: true }
)

const emitClose = () => emit('close')
const emitUpdate = () => emit('update', { ...editedUser })
</script>


<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="emitClose">
    <div class="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
      <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-800" @click="emitClose">
        &times;
      </button>

      <div class="text-center mb-4">
        <h2 class="text-lg font-semibold">
          {{ editable ? 'Edit User' : 'User Info' }}
        </h2>
      </div>

      <div class="space-y-4">
        <div class="flex justify-center">
          <img loading="lazy" :src="editedUser.profilePicture" alt="Profile" class="w-24 h-24 rounded-full object-cover" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium">First Name</label>
        <input v-model="editedUser.firstName" :readonly="!editable" :disabled="!editable"
          class="w-full mt-1 p-2 border rounded-md" type="text" />
      </div>

      <div>
        <label class="block text-sm font-medium">Last Name</label>
        <input v-model="editedUser.lastName" :readonly="!editable" :disabled="!editable"
          class="w-full mt-1 p-2 border rounded-md" type="text" />
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button @click="emitClose" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">Close</button>
        <button v-if="editable" @click="emitUpdate" class="px-4 py-2 bg-blue-600 text-white rounded-md">
          Save
        </button>
      </div>
    </div>
  </div>
</template>