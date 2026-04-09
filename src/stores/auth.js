import { useChatStore } from './chat.js'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useAuthStore = defineStore('auth', {
    state: () => {
        const token = localStorage.getItem('token') || null
        const admin = localStorage.getItem('admin') === 'true'
        const user = localStorage.getItem('user')
        const current_user = user ? JSON.parse(user) : null
        const matchesCache = reactive([])
        const messagesCache = reactive({})
        return { token, admin, current_user, matchesCache, messagesCache }
    },
    actions: {
        setAuth(token, user, admin = false) {
            this.token = token
            this.admin = admin
            this.current_user = user
            localStorage.setItem('token', token)
            localStorage.setItem('admin', admin)
            localStorage.setItem('user', JSON.stringify(user))
        },
        updateUser(user) {
            if (!user) return
            this.setAuth(this.token, user, this.admin)
        },
        logout() {
            this.token = null
            this.admin = null
            this.current_user = null
            localStorage.clear()
            useChatStore().clear()
        },
    },
})
