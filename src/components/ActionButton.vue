<script setup>
import Icon from "./Icon.vue";

const props = defineProps({
  icon: { type: String, default: "default" },
  iconStroke: { type: Number, default: 2 },
  iconFilled: { type: Boolean, default: false },
  label: { type: String, required: true },
  color: { type: String, default: "bg-gray-500" },
  onClick: { type: Function, default: null },
  testId: { type: String, default: null },
});
const handleClick = () => {
  props.onClick?.();
};
</script>
<template>
  <button
    @click="handleClick"
    :data-testid="testId"
    :class="`flex items-center gap-1 px-3 py-1 text-sm rounded-md text-white ${color}`"
  >
    <Icon v-if="icon" :name="icon" :stroke="iconStroke" :filled="iconFilled" />
    <span class="hidden md:inline">{{ label }}</span>
  </button>
</template>
