import React, { useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatSupport from '../../components/chat/ChatSupport';

const ChatInterface = () => {
  const navigate = useNavigate();
  
  // Force the chat to take the full page
  useEffect(() => {
    const chatSupportElement = document.querySelector("[data-chat-support]") as HTMLElement;
    if (chatSupportElement) {
      chatSupportElement.style.position = 'static';
      chatSupportElement.style.width = '100%';
      chatSupportElement.style.height = '100%';
      chatSupportElement.style.maxHeight = '100%';
      
      const chatWindow = chatSupportElement.querySelector("[data-chat-window]") as HTMLElement;
      if (chatWindow) {
        chatWindow.style.position = 'static';
        chatWindow.style.width = '100%';
        chatWindow.style.height = 'calc(100vh - 80px)';
        chatWindow.style.maxHeight = 'none';
        chatWindow.style.borderRadius = '0';
      }
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-background border-b border-border p-4 flex items-center">
        <Button variant="outline" onClick={() => navigate('/support')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Support
        </Button>
        <h1 className="text-xl font-bold ml-4">Live Chat Support</h1>
      </div>
      <div className="flex-1">
        <ChatSupport />
      </div>
    </div>
  );
};

export default ChatInterface;