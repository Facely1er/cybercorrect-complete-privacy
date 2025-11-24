import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { X, Send, MessageSquare, User, Loader2 } from 'lucide-react';
import { useChatSupport } from './ChatSupportProvider';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const ChatSupport = () => {
  const { isOpen, openChat, closeChat } = useChatSupport();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today with CyberCorrect?',
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined responses for demo
  const predefinedResponses = [
    {
      keywords: ['hello', 'hi', 'hey'],
      response: "Hello! How can I assist you with CyberCorrect today?"
    },
    {
      keywords: ['price', 'cost', 'pricing', 'subscription', 'plan'],
      response: "Our pricing starts at $49/month for the Starter plan. The Professional plan costs $99/month, and we offer custom Enterprise pricing. You can find more details on our pricing page."
    },
    {
      keywords: ['security', '800-171', 'compliance', 'assessment'],
      response: "CyberCorrect offers comprehensive tools for security and NIST 800-171 compliance, including assessment tools, documentation generators, and continuous monitoring capabilities. Would you like a demo of these features?"
    },
    {
      keywords: ['cui', 'controlled', 'unclassified', 'information'],
      response: "Our CUI management tools help you identify, mark, and protect Controlled Unclassified Information in accordance with NIST 800-171 requirements. The CUI Mapper is particularly useful for visualizing data flows."
    },
    {
      keywords: ['support', 'help', 'contact'],
      response: "You can reach our support team via email at support@cybercorrect.com or by phone at +1 (888) 618-6160 during business hours. We also offer comprehensive documentation at cybercorrect.com/documentation."
    },
    {
      keywords: ['trial', 'free', 'demo', 'start'],
      response: "You can explore our interactive demo to see all features and capabilities. Visit our demo page to get hands-on experience with our privacy assessment tools, data mapping, and compliance workflows."
    }
  ];

  // Function to scroll to bottom of chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate agent typing and response
    setTimeout(() => {
      const agentMessage = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputText),
        sender: 'agent' as const,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userText: string) => {
    // Convert user text to lowercase for easier matching
    const text = userText.toLowerCase();
    
    // Check for matches with predefined responses
    for (const item of predefinedResponses) {
      if (item.keywords.some(keyword => text.includes(keyword))) {
        return item.response;
      }
    }
    
    // Default response if no match found
    return "Thank you for your message. One of our compliance specialists will review your question and get back to you shortly. For immediate assistance, please call us at +1 (888) 618-6160.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col" data-chat-support>
      {/* Chat Button */}
      {!isOpen && (
        <Button 
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
          onClick={openChat}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-background border border-border rounded-lg shadow-lg flex flex-col h-[500px] max-h-[80vh] overflow-hidden" data-chat-window>
          {/* Chat Header */}
          <div className="p-4 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <div>
                <h3 className="font-medium">CyberCorrect Support</h3>
                <p className="text-xs opacity-80">We typically reply in a few minutes</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:text-white/80 hover:bg-primary/80"
              onClick={closeChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {message.sender === 'agent' && (
                      <div className="flex items-center mb-1">
                        <div className="bg-primary/20 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Support Agent</span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <div 
                      className={`text-xs mt-1 ${
                        message.sender === 'user' 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Support is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center">
              <textarea
                className="flex-1 border border-border rounded-lg p-2 text-sm min-h-12 max-h-32 resize-none focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
              <Button 
                size="icon" 
                className="ml-2 h-9 w-9"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;