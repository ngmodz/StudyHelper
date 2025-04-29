
import { useState, useEffect } from 'react';
import { ChatMessageProps } from '@/components/ai-chat/ChatMessage';

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  
  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-chat-history');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert ISO strings back to Date objects for timestamps
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to parse chat history', error);
        // Initialize with welcome message if parsing fails
        setMessages([{
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: new Date()
        }]);
      }
    } else {
      // Initialize with welcome message if no saved history
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date()
      }]);
    }
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-chat-history', JSON.stringify(messages));
    }
  }, [messages]);
  
  const addMessage = (message: Omit<ChatMessageProps, 'timestamp'>) => {
    const newMessage = {
      ...message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const clearHistory = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat history cleared. How can I help you today?',
      timestamp: new Date()
    }]);
    localStorage.removeItem('ai-chat-history');
  };
  
  return {
    messages,
    addMessage,
    clearHistory,
    setMessages
  };
}

export default useChatHistory;
