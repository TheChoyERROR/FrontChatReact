export interface User {
  id: string;
  username: string;
}

export interface Channel {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
  channelId: string;
}