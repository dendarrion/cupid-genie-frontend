import { useQuery } from '@vue/apollo-composable'
import QUERY_ALL_USERS from '@/graphql/queries/all_users.gql'

export function useAllUsers() {
  const { result, loading, error, refetch } = useQuery(QUERY_ALL_USERS, null, { fetchPolicy: 'cache-and-network' })
  return {
    usersResult: result,
    usersLoading: loading,
    usersError: error,
    usersRefetch: refetch,
  }
}
