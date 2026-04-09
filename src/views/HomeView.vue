<script setup>
import background from '@/assets/images/hero.jpg'
const bgUrl = background
</script>

<template>
  <!-- Background photo by Vija Rindo Pratama: https://www.pexels.com/photo/man-holding-baby-s-breath-flower-in-front-of-woman-standing-near-marble-wall-935789/ -->
  <main class="flex flex-col h-[calc(100vh-6rem)] w-full justify-center bg-cover bg-center"
    :style="{ backgroundImage: `url(${bgUrl})` }">
    <div class="absolute inset-0 bg-black/50 bg-opacity-50 backdrop-blur-md"></div>
    <div class="relative z-10">
      <h1 class="text-white text-shadow-lg font-bold text-4xl text-center"><span class="hidden md:inline">Welcome to</span> Cupid🏹Genie</h1>
      <h2 class="text-white text-shadow-lg text-xl text-center italic">
        <RouterLink to="/matches" class="bg-pink-300 rounded-md px-2 inline-block">Shoot</RouterLink>
        your shot.
      </h2>
    </div>
  </main>
</template>
