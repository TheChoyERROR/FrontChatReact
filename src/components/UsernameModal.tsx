import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql';
import { User } from '../types';

interface UsernameModalProps {
  onSelectUser: (user: User) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ onSelectUser }) => {
  const { data, loading, error } = useQuery(GET_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUserId) {
      const selectedUser = data.users.find((user: User) => user.id === selectedUserId);
      if (selectedUser) {
        onSelectUser(selectedUser);
      }
    }
  };

  if (loading) return <div className="modal">Loading users...</div>;
  if (error) return <div className="modal">Error loading users: {error.message}</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Your Username</h2>
        <form onSubmit={handleSubmit}>
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Select a user</option>
            {data.users.map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <button type="submit" disabled={!selectedUserId}>
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;