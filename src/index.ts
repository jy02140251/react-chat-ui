/**
 * React Chat UI - Component Library Entry Point
 *
 * Exports all public components, hooks, and types
 * for the chat UI component library.
 */

// Components
export { ChatWindow } from './components/ChatWindow';
export { MessageBubble } from './components/MessageBubble';
export { MessageInput } from './components/MessageInput';
export { ConversationList } from './components/ConversationList';

// Hooks
export { useChat } from './hooks/useChat';

// Types
export type {
  Message,
  Conversation,
  ChatUser,
  ChatConfig,
  MessageStatus,
  ChatTheme,
} from './types';