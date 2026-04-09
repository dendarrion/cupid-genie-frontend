<script setup>
import router from "@/router"
import { toast } from "vue3-toastify";
import { onMounted, ref, watch } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useMutation, useQuery } from "@vue/apollo-composable"
import QUERY_MATCHED from "@/graphql/queries/get_matched.gql"
import UNMATCH_USER from "@/graphql/mutations/unmatch_user.gql"
import ActionButton from "@/components/ActionButton.vue"

const store = useAuthStore()
const matches = ref([])

const { result, loading, error, refetch } = useQuery(QUERY_MATCHED, {
  id: store.current_user?.id
})
watch(
  () => result.value,
  (updated) => {
    if (updated?.matchedUsers) {
      matches.value = updated.matchedUsers;
    }
  },
  { immediate: true },
);
onMounted(() => refetch());
// // For some readon, does not work when newly logged in
// watch(
//   () => result.value,
//   (updated) => {
//     if (updated?.matchedUsers) {
//       matches.value = updated.matchedUsers;
//     }
//   },
//   { immediate: true },
// )
watch(() => error.value, (e) => {
  if (e) {
    console.error("Error fetching matches:", e);
  }
});

const { mutate: unmatchUserMutate } = useMutation(UNMATCH_USER);
const unmatchUser = async (targetUserId) => {
  try {
    const response = await unmatchUserMutate({ targetUserId });
    const payload = response?.data?.unmatchUser;
    console.log(matches.value);
    
    if (payload.success) {
      const removedUser = matches.value.find(
        (m) => m.otherUser.id === targetUserId
      );
      console.log(removedUser);
      
      matches.value = matches.value.filter(
        (match) => match.otherUser.id !== targetUserId
      );
      toast(
        removedUser
          ? `You have unmatched ${removedUser.otherUser.fullName}.`
          : 'User unmatched.',
          {
            icon: '💔',
            type: 'info',
            theme: 'auto',
            position: 'top-center',
          }
      )
    } else {
      const errMsg = payload.errors?.[0] || "Failed to unmatch user.";
      toast.error(errMsg, { position: 'top-center' });
    }
  } catch (err) {
    console.error("Error unmatching users:", err);
  }
};
const messageUser = (id) => {
  router.push(`/inbox/chat/${id}`);
};
</script>

<template>
  <div class="mx-4 md:mx-6 dark:text-white">
    <h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-5">My Matches</h1>

    <div v-if="loading" class="text-center py-6">Loading</div>

    <div v-else-if="error" class="text-center text-red-500 py-6">
      Error: {{ error }}
    </div>

    <div v-else>
      <div
        v-if="!matches || matches?.length === 0"
        class="text-center py-10 text-gray-500"
      >
        No matches yet.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="match in matches"
          :key="match.id"
          class="flex items-center gap-4 p-4 border rounded-lg md:grid md:grid-cols-[auto_1fr_auto] md:items-center"
        >
          <img
            :src="match.otherUser.profilePicture"
            :alt="'Picture of ' + match.otherUser.fullName"
            class="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover shrink-0"
          />

          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm md:text-base truncate">
              {{ match.otherUser.fullName }}
            </p>
            <p class="text-sm text-gray-500">
              {{ match.createdAt }}
            </p>
          </div>

          <div class="flex gap-2 md:justify-end">
            <ActionButton
              icon="heart_broken"
              label="Unmatch"
              color="bg-pink-600"
              @click="unmatchUser(match.otherUser.id)"
            />

            <ActionButton
              icon="message"
              label="Message"
              color="bg-blue-600"
              @click="messageUser(match.otherUser.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
