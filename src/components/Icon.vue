<script setup>
import { computed } from 'vue'
import { icons } from '@/assets/icons'

const props = defineProps({
  name: { type: String, required: true },
  stroke: { type: Number, default: 2 },
  filled: { type: Boolean, default: false },
  nonhover: { type: Boolean, default: false }
})
const baseClass = 'w-6 h-6 transition-all ease-out duration-200'
const iconClass = computed(() => {
  return [
    baseClass,
    props.filled
      ? 'fill-current stroke-0'
      : 'fill-none stroke-current',
    props.nonhover ? '' : 'group-hover:fill-current group-hover:fill-opacity-100 group-hover:stroke-0 group-hover:scale-125'
  ]
})
</script>

<template>
  <svg :class="iconClass" :stroke-width="props.stroke" viewBox="0 0 24 24">
    <path :d="icons[props.name || 'default']"></path>
  </svg>
</template>