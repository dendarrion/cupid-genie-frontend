import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'

import { DefaultApolloClient } from '@vue/apollo-composable'
import apolloClient from '@/apollo/index'

import App from './App.vue'
import router from './router'

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App),
})
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
