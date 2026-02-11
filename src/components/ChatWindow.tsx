/**
 * ChatWindow Component
 *
 * Main container component that assembles the complete chat interface
 * with a conversation sidebar and message area.
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ConversationList } from './ConversationList';
import type { ChatWindowProps } from '../types';

/**
 * Full-featured chat window with sidebar navigation and message display.
 *
 * @example
 * ```tsx
 * <ChatWindow
 *   messages={messages}
 *   conversations={conversations}
 *   currentUserId="user-1"
 *   onSendMessage={handleSend}
 * />
 * ```
 */
export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  conversations,
  currentUserId,
  onSendMessage,
  onSelectConversation,
  theme = 'light',
  showSidebar = true,
  placeholder = 'Type a message...',
}) => {
  const [activeConversation, setActiveConversation] = useState<string>(
    conversations[0]?.id ?? ''
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for the active conversation
  const activeMessages = messages.filter(
    (msg) => msg.conversationId === activeConversation
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    onSelectConversation?.(conversationId);
  };

  const handleSend = (content: string) => {
    if (activeConversation) {
      onSendMessage(content, activeConversation);
    }
  };

  // Find active conversation title
  const activeConv = conversations.find((c) => c.id === activeConversation);

  return (
    <div className={`chat-window chat-theme-${theme}`} role="main">
      {/* Sidebar */}
      {showSidebar && (
        <aside className="chat-sidebar">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversation}
            onSelect={handleSelectConversation}
          />
        </aside>
      )}

      {/* Message Area */}
      <div className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <h2 className="chat-header-title">
            {activeConv?.title ?? 'Select a conversation'}
          </h2>
          {activeConv && (
            <span className="chat-header-subtitle">
              {activeConv.participants.length} participants
            </span>
          )}
        </header>

        {/* Messages */}
        <div className="chat-messages" role="log" aria-live="polite">
          {activeMessages.length === 0 ? (
            <div className="chat-empty">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            activeMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUserId}
                showAvatar={msg.senderId !== currentUserId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <MessageInput
          onSend={handleSend}
          placeholder={placeholder}
          disabled={!activeConversation}
        />
      </div>
    </div>
  );
};