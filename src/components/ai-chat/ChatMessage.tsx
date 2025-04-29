
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: Date;
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';
  
  return (
    <div className={cn(
      "flex w-full items-start gap-2 py-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col space-y-1 max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-foreground glass-card"
        )}>
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{content}</div>
          ) : (
            <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-0 prose-li:my-0">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="my-1">{children}</p>,
                  h1: ({ children }) => <h1 className="text-xl font-bold my-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold my-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-md font-bold my-2">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc pl-4 my-0">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 my-0">{children}</ol>,
                  li: ({ children }) => <li className="my-0">{children}</li>,
                  code: ({ node, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !className;
                    
                    return isInline ? (
                      <code className="px-1 py-0.5 bg-muted-foreground/20 rounded font-normal" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-muted-foreground/10 p-2 rounded-md overflow-x-auto">
                        <code className="font-normal" {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        {timestamp && (
          <span className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-primary/10 text-primary">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
