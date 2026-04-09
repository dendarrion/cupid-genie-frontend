import { ApolloClient, InMemoryCache, split } from '@apollo/client/core'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'

const uploadLink = createUploadLink({
    uri: 'http://localhost:3000/graphql',
})
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
})
const httpLink = authLink.concat(uploadLink)
const wsLink = new GraphQLWsLink(
    createClient({ uri: 'ws://localhost:5000/', })
)

const link = split(
    ({query}) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        )
    },
    wsLink,
    httpLink
)

const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
});

export default apolloClient;