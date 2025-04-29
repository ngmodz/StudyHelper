import React, { useState } from 'react';
import { ArrowLeft, SendHorizontal, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMobile } from '@/hooks/use-mobile';
import { ChatMessage } from './ChatMessage';
import { useChatHistory } from '@/hooks/use-chat-history';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';

interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatDialog({
  isOpen,
  onOpenChange
}: ChatDialogProps) {
  const isMobile = useMobile();
  const [input, setInput] = useState('');
  const {
    messages,
    addMessage,
    clearHistory
  } = useChatHistory();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Use the provided API key directly
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OpenAI API key. Please check your .env file.');
  }

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    addMessage({
      role: 'user',
      content: input.trim()
    });
    setInput('');
    setIsLoading(true);

    try {
      // Call OpenAI API with improved prompt instructions
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that provides well-structured, organized responses. 
              Follow these guidelines:
              1. Use markdown formatting to structure your responses (headings, lists, bold, etc.)
              2. Break down complex answers into sections with clear headings when appropriate
              3. Use bullet points or numbered lists for multiple items or steps
              4. Bold important terms or concepts using **bold text**
              5. Keep paragraphs concise and focused on one idea
              6. Summarize key points at the end of longer responses`
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: input.trim()
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to communicate with OpenAI API');
      }

      const data = await response.json();
      const assistantResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      // Add assistant response to chat
      addMessage({
        role: 'assistant',
        content: assistantResponse
      });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Display error message
      addMessage({
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to communicate with OpenAI API.'}`
      });
      
      toast({
        title: "API Error",
        description: "There was a problem connecting to the AI service. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "Chat history cleared",
      description: "All previous messages have been removed"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-[100dvh] max-h-[100dvh] p-0 m-0 max-w-none w-full rounded-none flex flex-col" fullscreen>
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <DialogTitle className="flex-1 text-center">AI Assistant</DialogTitle>
          <div className="w-8"></div> {/* Empty div for balanced spacing */}
        </DialogHeader>
        
        <div className="flex flex-col h-full relative overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                <div className="mb-2">
                  <Bot className="h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">How can I help you today?</h3>
                  <p className="text-sm">Ask me anything and I'll do my best to assist you.</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  role={message.role} 
                  content={message.content} 
                  timestamp={message.timestamp} 
                />
              ))
            )}
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="animate-pulse">●</div>
                <div className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</div>
                <div className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t bg-background w-full py-4 px-4 flex flex-col">
            <div className="flex space-x-2">
              <Textarea 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} 
                placeholder="Type your message..." 
                className="min-h-10 flex-1 resize-none bg-background" 
                maxLength={500} 
                disabled={isLoading} 
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading} 
                size="icon" 
                className="h-10 w-10 shrink-0"
              >
                <SendHorizontal className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            
            <div className="flex justify-between items-center mt-3 pb-safe">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground hover:text-destructive" 
                    disabled={messages.length === 0}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all your conversation history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearHistory}>Clear</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <div className="text-xs text-muted-foreground">
                Powered by OpenAI
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatDialog;
