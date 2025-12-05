import React, { createContext, useState, useContext, ReactNode } from 'react';
import ChatSupport from './ChatSupport';

interface ChatSupportContextType {
  openChat: () => void;
  closeChat: () => void;
  isOpen: boolean;
}

export const ChatSupportContext = createContext<ChatSupportContextType | undefined>(undefined);

const useChatSupport = () => {
  const context = useContext(ChatSupportContext);
  if (context === undefined) {
    throw new Error('useChatSupport must be used within a ChatSupportProvider');
  }
  return context;
};

interface ChatSupportProviderProps {
  children: ReactNode;
}

const ChatSupportProvider: React.FC<ChatSupportProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <ChatSupportContext.Provider value={{ openChat, closeChat, isOpen }}>
      {children}
      <ChatSupport />
    </ChatSupportContext.Provider>
  );
};

export { useChatSupport, ChatSupportProvider };