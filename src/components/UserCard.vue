<script setup>
import { ref, toRef } from 'vue'
import { dragEvents } from '@/assets/scripts/dragEvents';

const props = defineProps(['user', 'index'])
const emit = defineEmits(['swipe', 'open-lightbox'])

const cardContainer = ref(null)
const scroller = ref(true)

const { startDrag, cardStyle } = dragEvents({
    emit: emit,
    object: toRef(props, 'user'),
    index: toRef(props, 'index'),
})

const fakeSwipe = (direction) => {
    emit('swipe', direction, props.user)
}
defineExpose({ fakeSwipe })

const handleScroll = () => {
    if (!cardContainer.value) return
    scroller.value = cardContainer.value.scrollTop < cardContainer.value.clientHeight / 3
}
const scrollToEnd = () => {
    if (!cardContainer.value) return

    scroller.value = false
    cardContainer.value.scrollTo({
        top: cardContainer.value.scrollHeight,
        behavior: 'smooth',
    })
}
</script>

<template>
    <div ref="cardContainer"
        class="lg:mt-20 bg-pink-300 w-full h-[85vh] overflow-y-auto bg-cover bg-center bg-no-repeat rounded-2xl shadow-2xl select-none scroll-hide touch-pan-y lg:touch-auto"
        :style="cardStyle" @scroll="handleScroll">

        <template v-if="props.index === 0">
            <div class="h-[75vh] w-full relative rounded-t-2xl cursor-grab" @mousedown="startDrag"
                @touchstart="startDrag">

                <div
                    class="bg-linear-to-t from-black via-black/40 to-transparent w-full h-24 px-4 py-2 absolute -bottom-7 left-0 flex items-end">
                </div>
                <div class="absolute bottom-4 left-4 text-white font-bold text-2xl text-shadow-lg">
                    {{ props.user.fullName }}, {{ props.user.age }}
                </div>
            </div>

            <button v-if="scroller"
                class="motion-safe:animate-bounce absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-30"
                @click="scrollToEnd">
                &darr; More
            </button>


            <div ref="galleryAnchor"
                class="bg-yellow-200/90 dark:bg-yellow-400/85 backdrop-blur-md relative p-4 pt-10 space-y-4 shadow-2xl rounded-t-4xl scroll-hide overflow-y-auto max-h-[calc(100vh-200px)]">
                <h3 class="text-pink-500 text-xl font-semibold">About</h3>
                <p class="text-xl">{{ props.user.bio }}</p>
                <h3 class="mt-5 text-pink-500 text-xl">Location</h3>
                <p class="text-xl">{{ props.user.city }}, {{ props.user.region }}, {{ props.user.country }}</p>

                <h3 class="mt-5 text-pink-500 text-xl">Gallery</h3>
                <div class="grid grid-cols-3 gap-2">
                    <img loading="lazy" v-for="(img, idx) in props.user.gallery" :key="idx" :src="img"
                        @click="$emit('open-lightbox', props.user, idx)"
                        class="w-full aspect-square object-cover rounded-md" />
                </div>
            </div>
        </template>

    </div>
</template>