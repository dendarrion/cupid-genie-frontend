import { useQuery } from '@vue/apollo-composable'
import { useAuthStore } from '@/stores/auth'
import QUERY_MATCHABLE from '@/graphql/queries/recommended_matches.gql'

export function useMatchable() {
  const store = useAuthStore()

  const { result, loading, error, onResult, refetch } = useQuery(
    QUERY_MATCHABLE,
    { id: store.current_user?.id },
    { 
      fetchPolicy: 'network-only',
      enabled: !!store.current_user?.id
    }
  )

  return {
    userCardsResult: result,
    userCardsLoading: loading,
    userCardsError: error,
    userCardsRefetch: refetch,
    userCardsOnResult: onResult,
  }
}
