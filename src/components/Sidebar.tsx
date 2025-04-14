import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CHANNELS } from '../graphql';
import { Channel, User } from '../types';

interface SidebarProps {
  currentUser: User;
  currentChannelId: string;
  onSelectChannel: (channelId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentChannelId, onSelectChannel }) => {
  const { data, loading, error } = useQuery(GET_CHANNELS);

  if (loading) return <div className="sidebar">Loading channels...</div>;
  if (error) return <div className="sidebar">Error loading channels: {error.message}</div>;

  return (
    <div className="sidebar">
      <div className="user-info">
        <div className="avatar">
          {currentUser.username.charAt(0).toUpperCase()}
        </div>
        <div className="username">
          {currentUser.username}
        </div>
      </div>
      
      <h3>Channels</h3>
      <ul className="channel-list">
        {data.channels.map((channel: Channel) => (
          <li 
            key={channel.id}
            className={channel.id === currentChannelId ? 'active' : ''}
            onClick={() => onSelectChannel(channel.id)}
          >
            # {channel.name}
          </li>
        ))}
      </ul>
      
      {/* Footer con firma */}
      <div className="sidebar-footer">
        <p>Developed with ❤️ by <span className="signature">TheChoy</span></p>
      </div>
    </div>
  );
};

export default Sidebar;