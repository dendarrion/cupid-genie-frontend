<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <Navbar />
  <!-- <div class="min-h-screen overflow-x-hidden"> -->
  <div class="min-h-screen">
    <div class="lg:pt-16 pb-20 lg:pb-0">
    <RouterView />
    </div>
  </div>
</template>