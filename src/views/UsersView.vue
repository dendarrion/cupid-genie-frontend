<script setup>
import UserModal from '@/components/UserModal.vue';
import { useAllUsers } from '@/composables/useAllUsers';
import { ref } from 'vue';
// import MUTATE_DELETE_USER from '@/graphql/mutations/delete_user.gql'

const showModal = ref(false)
const editable = ref(false)
const selectedUser = ref(null)

const openModal = (user, allow_edit = false) => {
    selectedUser.value = user
    showModal.value = true
    editable.value = allow_edit
}
const { usersResult, usersLoading, usersError } = useAllUsers()
</script>

<template>
    <main class="h-[calc(100vh-6rem)] mx-10">
        <div v-if="usersLoading">Loading...</div>
        <div v-else-if="usersError">Error: {{ usersError.message }}</div>
        <div v-else class="flex flex-wrap items-center justify-center gap-2">
            <div v-for="user in usersResult?.allUsers" :key="user.id"
                class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div class="flex justify-end px-4 pt-4 rounded-t-lg" :class="user.gender === 'male' ? 'bg-blue-400/30' : 'bg-pink-400/30'">
                </div>
                <div class="flex flex-col items-center pb-10">
                    <img class="w-24 h-24 mb-3 rounded-full shadow-lg" :src="user.profilePicture"
                        :alt="`Image of ${user.firstName} ${user.lastName}`" />
                    <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ user.firstName }} {{ user.lastName }}</h5>
                    <div class="flex flex-wrap mt-4 md:mt-6">
                        <button @click="openModal(user)"
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            View
                        </button>
                        <button @click="openModal(user, true)"
                            class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 focus:z-10 focus:ring-4 focus:ring-yellow-100 dark:focus:ring-yellow-700 dark:bg-gray-800 dark:text-yellow-400 dark:border-yellow-600 dark:hover:text-white dark:hover:bg-yellow-700">
                            Edit
                        </button>
                        <RouterLink to="#" class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-pink-200 hover:bg-pink-100 hover:text-pink-700 focus:z-10 focus:ring-4 focus:ring-pink-100 dark:focus:ring-pink-700 dark:bg-gray-800 dark:text-pink-400 dark:border-pink-600 dark:hover:text-white dark:hover:bg-pink-700">
                            Delete
                        </RouterLink>
                    </div>
                </div>
            </div>

            <div>
                <UserModal v-if="showModal" :editable="editable" :user="selectedUser" @close="showModal = false" />
            </div>
        </div>
    </main>
</template>