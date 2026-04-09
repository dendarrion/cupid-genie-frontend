<script setup>
import gql from 'graphql-tag'
import { computed, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'

const fetchMatchableUsers = gql`
  query fetchMatchable ($email: String!) {
    availableMatches (email: $email) {
      fullName
      age
      profilePicture
      bio
    }
  }
`

const mutateUserInteraction = gql`
  mutation likeMutation($targetUserId: ID!, $kind: InteractionKindEnum!) {
    createInteraction(targetUserId: $targetUserId, kind: $kind) {
      matched
      errors
    }
  }
`

const matchableUsers = async(email) => {
  try {
    const { result, loading, errors } = useQuery(fetchMatchableUsers, { email: 'maria.fernandez@genie.dendarrion.com' })    
    console.log(result.value);
    console.log(loading, loading.value);
    
    
  } catch (err) {
    console.error(`Error fetching matchable users ${err}`);
  }
}

const likeUser = async(userId) => {
  try {
    const { data } = await client.mutate({
      mutation: mutateUserInteraction,
      variables: { userId }
    })
    console.log(data);
  } catch (err) {
    console.error(`Error (dis/)liking ${err}`);
  }
}

const { result, loading, error } = useQuery(matchableUsers)
const images = computed(() => result.value?.users || [])
console.log(images);


// const images = [
//   'https://placehold.co/400x780/f4dbd6/FFFFFF?text=January',
//   // 'https://placehold.co/400x780/91d7e3/FFFFFF?text=February',
//   // 'https://placehold.co/400x780/f5bde6/FFFFFF?text=March',
//   // 'https://placehold.co/400x780/c6a0f6/FFFFFF?text=April',
//   // 'https://placehold.co/400x780/ed8796/FFFFFF?text=May',
//   // 'https://placehold.co/400x780/ee99a0/FFFFFF?text=June',
//   // 'https://placehold.co/400x780/f5a97f/FFFFFF?text=July',
//   // 'https://placehold.co/400x780/a6da95/FFFFFF?text=August',
// ]

const currentIndex = ref(0)
const isDragging = ref(false)
const dragStartX = ref(null)
const dragDeltaX = ref(0)

const onStart = (e) => {
  dragStartX.value = e.touches ? e.touches[0].clientX : e.clientX
  isDragging.value = true
}

const onMove = (e) => {
  if (dragStartX.value !== null) {
    const currentX = e.touches ? e.touches[0].clientX : e.clientX
    dragDeltaX.value = currentX - dragStartX.value
  }
}

const onEnd = async () => {
  if (!isDragging.value) return

  if (dragDeltaX.value > 100) {
    alert(`Liked ${currentIndex.value}`)
  //   // const user = images[currentIndex.value]
  //   // await likeUser(user.userId)
    if (currentIndex.value < images.length - 1) {
      currentIndex.value++
    }
  } else {
    dragDeltaX.value = 0

  }

  dragStartX.value = null
  isDragging.value = false
}

const getCardStyle = (idx) => {
  const diff = idx - currentIndex.value

  if (diff === 0) {
    // Cuyrrent
    return {
      zIndex: 30,
      transform: `translateX(${dragDeltaX.value}px) scale(1)`,
      opacity: 1,
    }
  } else if (diff === 1) {
    // Next
    return {
      zIndex: 20,
      transform: 'translateX(40px) scale(0.95)',
      opacity: 0.7,
    }
  } else if (diff === -1) {
    // Previous
    return {
      zIndex: 20,
      transform: 'translateX(-40px) scale(0.95)',
      opacity: 0.7,
    }
  } else {
    return {
      zIndex: -1,
      opacity: 0,
      transform: 'scale(0.9)'
    }
  }
}
</script>

<template>
  <main class="h-full w-full">
    <div class="flex justify-center items-center h-[calc(100vh-6rem)]">

      <div v-if="loading">
        Fetching all matches…
      </div>

      <div v-else-if="error">
        Error {{ error.message }}
      </div>

      <div v-else>
        <div v-if="currentIndex < images.length" class="w-[50vw] h-full relative select-none"
          @mousedown="onStart" @touchstart="onStart"
          @mousemove="onMove" @touchmove="onMove"
          @mouseup="onEnd" @touchend="onEnd">
  
          <div v-for="(user, idx) in result.availableMatches"
            :key="user.fullName"
            class="absolute top-0 left-0 w-full h-full transition-all duration-500 flex justify-center items-center"
            :style="getCardStyle(idx)">
  
            <img :src="image" class="rounded-xl shadow-xl max-h-full max-w-full object-contain pointer-events-none select-none"/>
            <div class="absolute bottom-4 left-4 text-white text-lg font-semibold py-2 px-5 bg-black">
              <h2>{{ user.fullName }}, {{ user.age }}</h2>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center justify-center">
          <img src="https://placehold.co/400x780/f4dbd6/FFFFFF?text=No more users" alt="" class="rounded-xl shadow-xl max-h-full max-w-full object-contain pointer-events-none select-none">
        </div>
      </div>

    </div>
  </main>
</template>
