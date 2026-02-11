/**
 * ConversationList Component
 *
 * Displays a searchable list of chat conversations
 * with unread indicators and last message preview.
 */

import React, { useState, useMemo } from 'react';
import type { ConversationListProps, Conversation } from '../types';

/**
 * Format a date to a relative time string.
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString();
}

/**
 * Searchable conversation list with unread badges.
 *
 * @example
 * ```tsx
 * <ConversationList
 *   conversations={conversations}
 *   activeConversationId="conv-1"
 *   onSelect={handleSelect}
 * />
 * ```
 */
export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelect,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(query) ||
        conv.lastMessage?.content.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="conversation-list">
      {/* Search bar */}
      <div className="conversation-search">
        <input
          type="text"
          className="search-input"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search conversations"
        />
      </div>

      {/* Conversation items */}
      <ul className="conversation-items" role="listbox">
        {filteredConversations.length === 0 ? (
          <li className="conversation-empty">No conversations found</li>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </ul>
    </div>
  );
};

/** Individual conversation list item */
const ConversationItem: React.FC<{
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}> = ({ conversation, isActive, onClick }) => {
  const { title, lastMessage, unreadCount, avatar, isGroup } = conversation;

  return (
    <li
      className={`conversation-item ${isActive ? 'conversation-active' : ''}`}
      onClick={onClick}
      role="option"
      aria-selected={isActive}
    >
      {/* Avatar */}
      <div className="conversation-avatar">
        {avatar ? (
          <img src={avatar} alt={title} className="avatar-img" />
        ) : (
          <div className="avatar-placeholder">
            {isGroup ? '#' : title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="conversation-content">
        <div className="conversation-header">
          <span className="conversation-title">{title}</span>
          {lastMessage && (
            <time className="conversation-time">
              {formatRelativeTime(lastMessage.timestamp)}
            </time>
          )}
        </div>
        <div className="conversation-preview">
          <span className="preview-text">
            {lastMessage?.content ?? 'No messages yet'}
          </span>
          {unreadCount > 0 && (
            <span className="unread-badge" aria-label={`${unreadCount} unread`}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};