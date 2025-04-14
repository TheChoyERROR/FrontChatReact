import { gql } from '@apollo/client';

// Query para obtener todos los canales
export const GET_CHANNELS = gql`
  query GetChannels {
    channels {
      id
      name
    }
  }
`;

// Query para obtener todos los usuarios
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
    }
  }
`;

// Query para obtener un usuario específicoo
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
    }
  }
`;

// Query para obtener un canal específico
export const GET_CHANNEL = gql`
  query GetChannel($id: ID!) {
    channel(id: $id) {
      id
      name
    }
  }
`;

// Query para obtener mensajes de un canal
export const GET_MESSAGES = gql`
  query GetMessages($channelId: ID!) {
    messages(channelId: $channelId) {
      id
      content
      createdAt
      sender {
        id
        username
      }
      channelId
    }
  }
`;

// Mutación para enviar un mensaje
export const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $senderId: ID!, $channelId: ID!) {
    sendMessage(content: $content, senderId: $senderId, channelId: $channelId) {
      id
      content
      createdAt
      sender {
        id
        username
      }
      channelId
    }
  }
`;

// Suscripción para recibir nuevos mensajes
export const MESSAGE_ADDED = gql`
  subscription MessageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      content
      createdAt
      sender {
        id
        username
      }
      channelId
    }
  }
`;