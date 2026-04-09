<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UserCard from '@/components/UserCard.vue'
import MatchModal from '@/components/MatchModal.vue'
import ActionButton from '@/components/ActionButton.vue'
import { useMatchable } from '@/composables/useMatchable'
import { useMatchFeedback } from '@/composables/useMatchFeedback'
import { useAddInteraction } from '@/composables/useAddInteraction'

const userCards = ref([])
const seenUserIds = ref(new Set())

const {
    userCardsLoading,
    userCardsOnResult,
    userCardsError,
    userCardsRefetch,
} = useMatchable()

userCardsOnResult((res) => {
    const result = res?.data?.recommendedMatches ?? []
    userCards.value = result.filter(u => !seenUserIds.value.has(u.id))
})

const viewState = computed(() => {
    if (userCardsLoading.value) return 'loading'
    if (userCardsError.value) return 'error'
    if (!userCards.value.length) return 'empty'
    return 'ready'
})

const {
    addInteractionResult,
    addInteractionOnDone,
    addInteractionOnError,
} = useAddInteraction()

const isSwiping = ref(false);
const fakeSwipe = (direction) => {
    const top = userCards.value[0]
    if (top) handleSwipe(direction, top);
};

const removeTopCard = (user) => {
    userCards.value = userCards.value.filter(u => u.id !== user.id)
}

const handleSwipe = async (direction, user) => {
    if (isSwiping.value || !user) return;

    const currentTop = userCards.value[0]
    if (!currentTop || currentTop.id !== user.id) return;
    
    isSwiping.value = true;
    const kind = direction === "right" ? "LIKE" : "SKIP";
    try {
      await addInteractionResult(user.id, kind);
      seenUserIds.value.add(user.id);
      removeTopCard(user);
    } catch (err) {
      console.error("Swipe failed", err);
    } finally {
      isSwiping.value = false;
    }
}

const { showMatchModal, matchedUser } = useMatchFeedback({
    onDone: addInteractionOnDone,
    onError: addInteractionOnError,
})

const showLightbox = ref(false)
const lightboxUser = ref(null)
const currentIndex = ref(0)

const openLightbox = (user, index = 0) => {
    lightboxUser.value = user
    currentIndex.value = index
    showLightbox.value = true
}
const closeLightbox = () => {
    lightboxUser.value = null
    showLightbox.value = false
}
const nextImage = () => {
    if (!lightboxUser.value) return
    const items = lightboxUser.value?.gallery?.length || 0
    if (!items) return
    currentIndex.value = (currentIndex.value + 1) % items
}
const prevImage = () => {
    if (!lightboxUser.value) return
    const items = lightboxUser.value?.gallery?.length || 0
    if (!items) return
    currentIndex.value = (currentIndex.value - 1 + items) % items
}

onMounted(() => {
    seenUserIds.value.clear()
    userCardsRefetch()
})

const store = useAuthStore()
</script>

<template>
    <main class="pt-5 h-[calc(100dvh-4.6em)] md:mt-2 w-full flex items-center justify-center relative overflow-hidden">
        <template v-if="viewState === 'loading'">
            <div
                class="bg-gray-400 animate-pulse fade absolute w-[90vw] max-w-md h-[80vh] rounded-2xl shadow-lg flex items-center justify-center">
                <div class="h-[75vh] w-full relative rounded-t-2xl">
                    <div class="absolute bottom-4 left-4 font-bold text-2xl text-shadow-lg">
                        Fetching users…
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="viewState === 'error'">Error: {{ userCardsError.message }}</template>

        <template v-else-if="viewState === 'empty'">
            <div
                class="bg-pink-300 dark:bg-pink-400 dark:text-white absolute w-[90vw] max-w-md h-[80vh] rounded-2xl shadow-lg flex flex-col gap-2 items-center justify-center">
                <div class="h-[75vh] w-full relative rounded-t-2xl flex items-center justify-center">
                    <div class="absolute bottom-4 left-4 font-bold text-2xl text-shadow-lg">
                        No more users to swipe…
                    </div>
                    <!-- <button class="bg-gray-400 hover:bg-gray-500 p-2 shadow-md rounded-md" @click="userCardsRefetch">
                        🔄 Reload
                    </button> -->
                </div>
            </div>
        </template>

        <template v-else>
            <div class="relative w-[90vw] max-w-md h-full flex items-center justify-center">
                <ActionButton @click="fakeSwipe('left')"
                    color="bg-gray-500/70 hover:bg-gray-200 absolute -left-6 top-1/2 -translate-y-1/2 z-100"
                    icon="heart_broken" label="" />

                <ActionButton @click="fakeSwipe('right')"
                    color="bg-pink-500/70 hover:bg-pink-200 absolute -right-6 top-1/2 -translate-y-1/2 z-100"
                    icon="heart" label="" />

                <TransitionGroup name="user-card" tag="div" class="relative w-full h-full">
                    <UserCard v-for="(user, i) in userCards" :key="user.id"
                        :user="user" :index="i" class="absolute inset-0" @open-lightbox="openLightbox"
                        @swipe="handleSwipe" />
                </TransitionGroup>
            </div>

            <div v-if="showLightbox" @click.self="closeLightbox"
                class="fixed inset-0 bg-black/80 flex items-center justify-center z-1000">
                <img v-if="lightboxUser" id="lightbox" loading="lazy" :src="lightboxUser.gallery?.[currentIndex]"
                    class="max-w-full max-h-full object-contain" />
                <button class="absolute top-4 right-4 text-white text-3xl" @click="closeLightbox">
                    &times;
                </button>

                <button class="absolute left-4 text-white text-4xl px-4 py-2 bg-black/50 rounded-full"
                    @click.stop="prevImage">
                    &larr;
                </button>
                <button class="absolute right-4 text-white text-4xl px-4 py-2 bg-black/50 rounded-full"
                    @click.stop="nextImage">
                    &rarr;
                </button>
            </div>

            <template v-if="showMatchModal && store.current_user">
                <MatchModal :user1="store.current_user" :user2="matchedUser" @close="showMatchModal = false" />
            </template>
        </template>
    </main>
</template>