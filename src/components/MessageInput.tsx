import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../graphql';
import { User } from '../types';

interface MessageInputProps {
  channelId: string;
  currentUser: User;
}

const MessageInput: React.FC<MessageInputProps> = ({ channelId, currentUser }) => {
  const [messageContent, setMessageContent] = useState('');
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageContent.trim() === '') return;
    
    try {
      await sendMessage({
        variables: {
          content: messageContent,
          senderId: currentUser.id,
          channelId: channelId
        }
      });
      
      setMessageContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Type a message..."
        disabled={loading}
      />
      <button type="submit" disabled={loading || messageContent.trim() === ''}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput;