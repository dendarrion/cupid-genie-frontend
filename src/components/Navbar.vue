<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Link from '@/components/Nav/Link.vue';
import Icon from './Icon.vue';

const router = useRouter()
const store = useAuthStore()
const isOpen = ref(false)

const toggleDropdown = () => isOpen.value = !isOpen.value
const closeDropdown = (e) => {
    if (!e.target.closest('.relative')) {
        isOpen.value = false
    }
}

const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
        store.logout()
        router.push({ name: 'login' })
    }
}

document.addEventListener('click', closeDropdown);
</script>

<template>
    <nav class="
        fixed z-50 h-16
        left-0 right-0
        bg-pink-500 dark:bg-pink-700
        text-white shadow-md
        bottom-0 px-2
        lg:top-0 lg:bottom-auto lg:px-4
    ">
        <div class="flex items-center justify-between h-full">

            <RouterLink to="/" class="flex items-center h-full font-bold">
                <span class="lg:hidden text-xl">🏹</span>
                <span class="hidden lg:inline">CupidGenie</span>

                <!-- Future branding image -->
                <!-- <img
                src="/brand-logo.svg"
                alt="CupidGenie"
                class="h-8 w-auto hidden lg:block"
                />
                -->
            </RouterLink>

            <div v-if="!store.current_user" class="flex items-center space-x-2 h-full">
                <RouterLink to="/login" class="bg-yellow-400 text-pink-600 px-3 py-1 rounded-md flex items-center">
                    Login
                </RouterLink>
                <RouterLink to="/signup" class="bg-yellow-400 text-pink-600 px-3 py-1 rounded-md flex items-center">
                    Signup
                </RouterLink>
            </div>

            <template v-else>
                <div class="flex items-center justify-center space-x-4 lg:hidden">
                    <RouterLink to="/swipe" class="group flex flex-col items-center text-xs">
                        <Icon name="fire" />
                        Swipe
                    </RouterLink>

                    <RouterLink to="/matches" class="group flex flex-col items-center text-xs">
                        <Icon name="heart" />
                        Match
                    </RouterLink>

                    <RouterLink to="/liked" class="group flex flex-col items-center text-xs">
                        <Icon name="like" />
                        Liked
                    </RouterLink>

                    <RouterLink to="/inbox" class="group flex flex-col items-center text-xs">
                        <Icon name="message" />
                        Inbox
                    </RouterLink>
                </div>

                <div class="hidden lg:flex items-center space-x-6 h-full">
                    <Link route="/swipe" text="Swipe" />
                    <Link route="/matches" text="Matches" />
                    <Link route="/liked" text="Liked" />
                    <Link route="/inbox" text="Inbox" />
                </div>

                <div class="relative ml-2">
                    <button @click="toggleDropdown" class="p-1 rounded-full hover:bg-yellow-400">
                        <img :src="store.current_user.gallery?.[0] || '/default-avatar.png'"
                            class="w-8 h-8 rounded-full object-cover" />
                    </button>

                    <div v-if="isOpen" class="absolute right-0 bottom-full mb-3 lg:top-full lg:bottom-auto
                   bg-yellow-400 text-pink-600 w-40 rounded-md shadow-lg">
                        <RouterLink to="/profile"
                            class="block px-4 py-2 hover:bg-pink-500 hover:text-white hover:rounded-t-md">
                            Profile
                        </RouterLink>
                        <button @click.prevent="handleLogout"
                            class="w-full text-left px-4 py-2 hover:bg-pink-500 hover:text-white hover:rounded-b-md">
                            Logout
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </nav>
</template>
