import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo-client';
import UsernameModal from './components/UsernameModal';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { User } from './types';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentChannelId, setCurrentChannelId] = useState<string>('1'); // Default to first channel

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
  };

  const handleSelectChannel = (channelId: string) => {
    setCurrentChannelId(channelId);
  };

  return (
    <ApolloProvider client={client}>
      <div className="app">
        {!currentUser ? (
          <UsernameModal onSelectUser={handleSelectUser} />
        ) : (
          <div className="chat-container">
            <Sidebar 
              currentUser={currentUser} 
              currentChannelId={currentChannelId} 
              onSelectChannel={handleSelectChannel} 
            />
            <div className="chat-content">
              <MessageList 
                channelId={currentChannelId} 
                currentUser={currentUser} 
              />
              <MessageInput 
                channelId={currentChannelId} 
                currentUser={currentUser} 
              />
            </div>
          </div>
        )}
      </div>
    </ApolloProvider>
  );
}

export default App;
