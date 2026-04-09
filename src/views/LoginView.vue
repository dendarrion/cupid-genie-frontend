<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { toast } from 'vue3-toastify';

const forms = ref({
    email: '',
    password: '',
})
const errors = ref('')

const router = useRouter()
const { loginUser } = useAuth()

const handleLogin = async() => {
    try {
        await loginUser(forms.value.email, forms.value.password)
        router.push('/swipe')
        toast('Logging in', {
            'theme': 'auto',
            'type': 'default',
            'position': 'bottom-center',
        })
    } catch (err) {
        errors.value = err.message
        console.log(err)
    }
}
</script>

<template>
  <main class="flex justify-center items-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
    <form @submit.prevent="handleLogin" class="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">Login</h2>

      <ul v-if="errors.length" class="mb-4 text-red-500 text-sm">
        <li>{{ errors }}</li>
      </ul>

      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <input
          id="email"
          v-model="forms.email"
          type="email"
          placeholder="Email"
          data-testid="login-email"
          class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
        <input
          id="password"
          v-model="forms.password"
          type="password"
          placeholder="Password"
          data-testid="login-password"
          class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <button
        type="submit"
        data-testid="login-submit-btn"
        class="w-full p-2 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors"
      >
        Login
      </button>
    </form>
  </main>
</template>
