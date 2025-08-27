import React, { createContext, useState, useContext, ReactNode } from 'react';
import ChatGuideBot from './ChatGuideBot';

interface ChatbotContextType {
  openChatbot: () => void;
  closeChatbot: () => void;
  isOpen: boolean;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = () => setIsOpen(true);
  const closeChatbot = () => setIsOpen(false);

  return (
    <ChatbotContext.Provider value={{ openChatbot, closeChatbot, isOpen }}>
      {children}
      <ChatGuideBot />
    </ChatbotContext.Provider>
  );
};