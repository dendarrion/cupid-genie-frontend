import { useMutation } from '@vue/apollo-composable'
import MUTATE_CREATE_INTERACTION from '@/graphql/mutations/create_interaction.gql'

export function useAddInteraction() {
  const { mutate: createInteraction, loading, onDone, onError } = useMutation(MUTATE_CREATE_INTERACTION)

  const interactionResult = async (targetUserId, kind) => {
    const { data, errors } = await createInteraction({ targetUserId, kind })
    const result = data?.createInteraction

    if (result?.interaction) {
      return result
    } 

    const err = 
      (Array.isArray(result?.errors) ? result.errors.join(', ') : result?.errors)
      ?? errors?.[0]?.message
      ?? 'Failed adding interaction'
    throw new Error(err)
  }

  return {
    addInteractionResult: interactionResult,
    addInteractionLoading: loading,
    addInteractionOnDone: onDone,
    addInteractionOnError: onError,
  }
}