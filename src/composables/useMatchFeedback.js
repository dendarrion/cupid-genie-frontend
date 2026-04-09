import { ref } from "vue";
import { toast } from "vue3-toastify";

const ACTION_FEEDBACK = {
  LIKE: { icon: "️❤️", type: "success" },
  BLOCK: { icon: "⛔", type: "error" },
  SKIP: { icon: "❌", type: "error" },
};

export function useMatchFeedback({ onDone, onError }) {
  const showMatchModal = ref(false);
  const matchedUser = ref(null);

  onDone((res) => {
    const { matched, interaction, errors } = res?.data?.createInteraction;

    if (!interaction) {
      const err = errors?.[0] || "Interaction failed";
      toast.error(err, { position: "top-center" });
      return;
    }

    if (matched) {
      matchedUser.value = interaction.targetUser;
      showMatchModal.value = true;
      return;
    }

    const feedback = ACTION_FEEDBACK[interaction.kind];
    const message = `${interaction.kind[0]}${interaction.kind.slice(1).toLowerCase()} ${interaction.targetUser.fullName}`;
    toast(message, {
      icon: feedback.icon,
      theme: "auto",
      type: feedback.type,
      position: "top-right",
    });
  });
  onError(console.error);
  return {
    showMatchModal,
    matchedUser,
  };
}
