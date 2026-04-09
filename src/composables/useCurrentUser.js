import { useQuery } from '@vue/apollo-composable'
import QUERY_USER from '@/graphql/queries/current_user.gql'
// import { useAuthStore } from '@/stores/auth'

export function useCurrentUser() {
  const { result, loading, error, refetch } = useQuery(QUERY_USER, null, { fetchPolicy: 'network-only' })

  // const refreshUser = () => {
  //   refetch()
  //   const store = useAuthStore()
  //   store.updateUser(user = result.)
  // }

  return {
    currentUserResult: result,
    currentUserLoading: loading,
    currentUserError: error,
    currentUserRefetch: refetch,
  }
}
