'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date | string;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface ChatInterfaceProps {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
}

function formatMessageTime(date: Date | string) {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const time = messageDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (messageDate.toDateString() === today.toDateString()) {
    return time;
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday ' + time;
  } else {
    return messageDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    }) + ' ' + time;
  }
}

export default function ChatInterface({
  conversationId,
  currentUserId,
  initialMessages,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Poll for new messages
  useEffect(() => {
    const pollMessages = async () => {
      try {
        const response = await fetch('/api/conversations/' + conversationId + '/messages');
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    const interval = setInterval(pollMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    // Optimistic update
    const optimisticMessage: Message = {
      id: 'temp-' + Date.now(),
      content: messageContent,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId,
        name: 'You',
        image: null,
      },
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await fetch('/api/conversations/' + conversationId + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace optimistic message with real one
        setMessages(prev =>
          prev.map(m => (m.id === optimisticMessage.id ? data.message : m))
        );
      } else {
        // Remove optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        setNewMessage(messageContent);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.senderId === currentUserId;
            const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId;

            return (
              <div
                key={message.id}
                className={'flex gap-3 ' + (isOwn ? 'flex-row-reverse' : '')}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-8">
                  {showAvatar && !isOwn && (
                    message.sender.image ? (
                      <img
                        src={message.sender.image}
                        alt={message.sender.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-slate-600 text-sm font-medium">
                          {message.sender.name.charAt(0)}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Message Bubble */}
                <div className={'max-w-[70%] ' + (isOwn ? 'items-end' : 'items-start')}>
                  <div
                    className={
                      'px-4 py-2 rounded-2xl ' +
                      (isOwn
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-900 rounded-bl-md')
                    }
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <p className={'text-xs mt-1 ' + (isOwn ? 'text-right' : '') + ' text-slate-400'}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="sr-only sm:not-sr-only">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
