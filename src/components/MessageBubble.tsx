/**
 * MessageBubble Component
 *
 * Renders an individual chat message with avatar, content,
 * timestamp, and delivery status indicators.
 */

import React from 'react';
import type { MessageBubbleProps, MessageStatus } from '../types';

/** Maps message status to display icon */
const statusIcons: Record<MessageStatus, string> = {
  sending: '\u23F3',
  sent: '\u2713',
  delivered: '\u2713\u2713',
  read: '\u2713\u2713',
  failed: '\u26A0',
};

/**
 * Format a timestamp to a human-readable time string.
 */
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('default', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Individual message bubble with avatar and status indicators.
 *
 * @example
 * ```tsx
 * <MessageBubble
 *   message={message}
 *   isOwn={true}
 *   showAvatar={false}
 * />
 * ```
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true,
  sender,
  onRetry,
}) => {
  const bubbleClass = [
    'message-bubble',
    isOwn ? 'message-own' : 'message-other',
    message.status === 'failed' ? 'message-failed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`message-row ${isOwn ? 'message-row-own' : ''}`}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="message-avatar">
          {sender?.avatar ? (
            <img src={sender.avatar} alt={sender.name} className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">
              {(sender?.name ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <div className={bubbleClass}>
        {/* Sender name for group chats */}
        {!isOwn && sender && (
          <span className="message-sender">{sender.name}</span>
        )}

        {/* Content */}
        {message.type === 'text' && (
          <p className="message-content">{message.content}</p>
        )}

        {message.type === 'image' && (
          <img
            src={message.content}
            alt="Shared image"
            className="message-image"
            loading="lazy"
          />
        )}

        {message.type === 'system' && (
          <p className="message-system">{message.content}</p>
        )}

        {/* Footer with time and status */}
        <div className="message-footer">
          <time className="message-time">{formatTime(message.timestamp)}</time>
          {isOwn && (
            <span
              className={`message-status status-${message.status}`}
              title={message.status}
            >
              {statusIcons[message.status]}
            </span>
          )}
        </div>

        {/* Retry button for failed messages */}
        {message.status === 'failed' && onRetry && (
          <button
            className="message-retry-btn"
            onClick={() => onRetry(message.id)}
            aria-label="Retry sending message"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};