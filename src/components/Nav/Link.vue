<script setup>
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute()
const isActivePage = (routePath) => routePath === route.path

const props = defineProps(['route', 'text'])
</script>

<template>
  <RouterLink :to="props.route" :class="['hover:text-yellow-400', isActivePage(`${props.route}`) ? 'font-bold' : '']">
    {{ props.text }}
  </RouterLink>
</template>