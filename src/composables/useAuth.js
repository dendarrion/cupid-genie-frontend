import { useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '@/stores/auth'
import LOGIN_MUTATION from '@/graphql/mutations/login.gql'

export function useAuth() {
    const store = useAuthStore()
    const { mutate: loginMutation, loading, error } = useMutation(LOGIN_MUTATION)

    const loginUser = async (email, password) => {
        const { data, errors } = await loginMutation({ email, password })
        const result = data?.loginUser

        if (result?.token) {
            store.setAuth(result.token, result.user, result.admin)
            return result
        } else {
            const err = result?.errors || errors?.[0]?.message || 'Something went wrong logging in'
            console.error(err, errors);
            throw new Error(err)
        }
    }

    return {
        loginUser,
        loginLoading: loading,
        loginError: error,
    }
}
