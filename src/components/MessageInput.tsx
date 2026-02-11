/**
 * MessageInput Component
 *
 * Text input area with send button, character counter,
 * and keyboard shortcut support (Enter to send).
 */

import React, { useState, useRef, useCallback } from 'react';
import type { MessageInputProps } from '../types';

/**
 * Chat message input with send functionality.
 *
 * Supports Enter to send, Shift+Enter for new line,
 * and auto-expanding textarea.
 *
 * @example
 * ```tsx
 * <MessageInput
 *   onSend={handleSend}
 *   placeholder="Type a message..."
 *   maxLength={2000}
 * />
 * ```
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength = 2000,
  showEmojiPicker = false,
  showAttachment = false,
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Auto-resize textarea based on content */
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, []);

  /** Handle sending the message */
  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setText('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [text, disabled, onSend]);

  /** Handle keyboard events - Enter to send, Shift+Enter for newline */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
      adjustHeight();
    }
  };

  const remainingChars = maxLength - text.length;
  const isNearLimit = remainingChars < 100;

  return (
    <div className="message-input-container">
      {/* Attachment button */}
      {showAttachment && (
        <button
          className="input-action-btn"
          aria-label="Attach file"
          disabled={disabled}
        >
          📎
        </button>
      )}

      {/* Text input */}
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="message-textarea"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message input"
        />
        {isNearLimit && (
          <span className="char-counter" aria-live="polite">
            {remainingChars}
          </span>
        )}
      </div>

      {/* Emoji picker button */}
      {showEmojiPicker && (
        <button
          className="input-action-btn"
          aria-label="Open emoji picker"
          disabled={disabled}
        >
          😊
        </button>
      )}

      {/* Send button */}
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};