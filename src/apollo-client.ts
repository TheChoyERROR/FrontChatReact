import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/graphql';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:4000/graphql';
// HTTP connection to the API
const httpLink = new HttpLink({
  uri: API_URL,
});

// WebSocket connection for subscriptions
// Añadiendo opciones de configuración adicionales para evitar errores
const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
    connectionParams: {},
    retryAttempts: 5,
    shouldRetry: () => true,
    connectionAckWaitTimeout: 10000,
  })
);

// Split links for HTTP operations vs WebSocket operations
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Create Apollo Client instance
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});