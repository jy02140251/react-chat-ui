/**
 * Type Definitions for React Chat UI.
 *
 * Centralized type definitions used across all
 * components and hooks in the library.
 */

/** Supported message status values */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/** Chat UI theme options */
export type ChatTheme = 'light' | 'dark' | 'auto';

/** Represents a chat user */
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

/** Represents a single chat message */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
}

/** Represents a conversation thread */
export interface Conversation {
  id: string;
  title: string;
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  isGroup: boolean;
  avatar?: string;
}

/** Configuration for the useChat hook */
export interface ChatConfig {
  /** WebSocket server URL */
  wsUrl: string;
  /** Current user ID */
  userId: string;
  /** Authentication token */
  token?: string;
  /** Auto-reconnect on disconnect */
  autoReconnect?: boolean;
  /** Reconnect interval in milliseconds */
  reconnectInterval?: number;
  /** Maximum reconnect attempts */
  maxReconnectAttempts?: number;
  /** Message history page size */
  pageSize?: number;
}

/** Props for ChatWindow component */
export interface ChatWindowProps {
  messages: Message[];
  conversations: Conversation[];
  currentUserId: string;
  onSendMessage: (content: string, conversationId: string) => void;
  onSelectConversation?: (conversationId: string) => void;
  theme?: ChatTheme;
  showSidebar?: boolean;
  placeholder?: string;
}

/** Props for MessageBubble component */
export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  sender?: ChatUser;
  onRetry?: (messageId: string) => void;
}

/** Props for MessageInput component */
export interface MessageInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showEmojiPicker?: boolean;
  showAttachment?: boolean;
}

/** Props for ConversationList component */
export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelect: (conversationId: string) => void;
  onSearch?: (query: string) => void;
}