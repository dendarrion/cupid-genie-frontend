<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <section class="flex flex-col h-10/12 text-center">
        <h1 class="text-4xl font-bold">Not found</h1>
        <p class="mb-4">This page does not exist</p>
        <RouterLink to="/" class="inline-block bg-pink-400 p-2 rounded-md">Back</RouterLink>
    </section>
</template>