<script setup>
import router from "@/router";
import { toast } from "vue3-toastify";
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useQuery, useMutation } from "@vue/apollo-composable";
import QUERY_LIKED from "@/graphql/queries/liked_users.gql";
import UNLIKE_USER from "@/graphql/mutations/unlike_user.gql";
import ActionButton from "@/components/ActionButton.vue";

const store = useAuthStore();
const liked_users = ref([]);

const { result, loading, error, refetch } = useQuery(QUERY_LIKED, {
  id: store.current_user?.id,
})
watch(
  () => result.value,
  (updated) => {
    if (updated?.likedUsers) {
      liked_users.value = updated.likedUsers;
    }
  },
  { immediate: true },
);
onMounted(() => {
  refetch();
});

const { mutate: unlikeUserMutate } = useMutation(UNLIKE_USER);
const unlikeUser = async (targetUserId) => {
  try {
    const response = await unlikeUserMutate({ targetUserId });
    const payload = response?.data?.unlikeUser;
    if (payload.success) {
      const removedUser = liked_users.value.find(u => u.id === targetUserId)
      liked_users.value = liked_users.value.filter(
        (user) => user.id !== targetUserId,
      )
      toast(
        removedUser
          ? `You have unliked ${removedUser.fullName}.`
          : 'User unliked.',
          {
            icon: '💔',
            type: 'info',
            theme: 'auto',
            position: 'top-right',
          }
      )
    } else {
      const errMsg = payload.errors?.[0] || 'Failed to unlike user.';
      toast.error(errMsg, { position: 'top-center' });
    }
  } catch (error) {
    console.error("Error unliking user:", error);
  }
};
const messageUser = (id) => {
  router.push(`/inbox/chat/${id}`);
};
</script>

<template>
  <div class="mx-4 md:mx-6 dark:text-white">
    <h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-5">Liked Users</h1>

    <div v-if="loading" class="text-center py-6">Loading</div>

    <div v-else-if="error" class="text-center text-red-500 py-6">
      Error: {{ error }}
    </div>

    <div v-else>
      <div
        v-if="!liked_users || liked_users.length === 0"
        class="text-center py-10 text-gray-500"
      >
        No liked users yet.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="liked_user in liked_users"
          :key="liked_user.id"
          class="flex items-center gap-3 p-3 border rounded-lg md:grid md:grid-cols-[auto_1fr_auto] md:items-center"
        >
          <img
            :src="liked_user.profilePicture"
            :alt="'Picture of ' + liked_user.fullName"
            class="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover shrink-0"
          />

          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm md:text-base truncate">
              {{ liked_user.fullName }}
            </p>
          </div>

          <div class="flex gap-2 md:justify-end">
            <ActionButton
              icon="unlike"
              label="Unlike"
              color="bg-pink-600"
              @click="unlikeUser(liked_user.id)"
            />
            <ActionButton
              icon="message"
              label="Message"
              color="bg-blue-600"
              @click="messageUser(liked_user.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
