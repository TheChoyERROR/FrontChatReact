import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MESSAGES, MESSAGE_ADDED } from '../graphql';
import { Message, User } from '../types';

interface MessageListProps {
  channelId: string;
  currentUser: User;
}

const MessageList: React.FC<MessageListProps> = ({ channelId, currentUser }) => {
  const { loading, error, data, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { channelId },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // Mejorar el manejo de errores y desuscripción
    try {
      const unsubscribe = subscribeToMore({
        document: MESSAGE_ADDED,
        variables: { channelId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          
          const newMessage = subscriptionData.data.messageAdded;
          
          // Si no hay data previa, inicializar con un array vacío
          if (!prev || !prev.messages) {
            return { messages: [newMessage] };
          }
          
          // Return immediately if we already have this message (prevents duplicates)
          if (prev.messages.find((msg: Message) => msg.id === newMessage.id)) {
            return prev;
          }

          return {
            messages: [...prev.messages, newMessage],
          };
        },
        onError: (error) => {
          console.error("Subscription error:", error);
        }
      });

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error("Error setting up subscription:", error);
    }
  }, [channelId, subscribeToMore]);

  if (loading) return <div className="message-list">Loading messages...</div>;
  if (error) return <div className="message-list">Error loading messages: {error.message}</div>;
  if (!data || !data.messages) return <div className="message-list">No messages available</div>;

  return (
    <div className="message-list">
      {data.messages.length === 0 ? (
        <div className="no-messages">No messages in this channel yet.</div>
      ) : (
        data.messages.map((message: Message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender.id === currentUser.id ? 'own-message' : ''}`}
          >
            <div className="message-avatar">
              {message.sender.username.charAt(0).toUpperCase()}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="sender-name">{message.sender.username}</span>
                <span className="timestamp">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-text">{message.content}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;