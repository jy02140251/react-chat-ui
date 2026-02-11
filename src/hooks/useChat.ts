/**
 * useChat Hook
 *
 * Core chat state management hook that handles WebSocket
 * connection, message sending/receiving, and conversation state.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message, Conversation, ChatConfig } from '../types';

/** Return type for the useChat hook */
interface UseChatReturn {
  /** All messages across conversations */
  messages: Message[];
  /** All conversations */
  conversations: Conversation[];
  /** Currently active conversation ID */
  activeConversationId: string | null;
  /** WebSocket connection status */
  isConnected: boolean;
  /** Whether messages are being loaded */
  isLoading: boolean;
  /** Send a text message to the active conversation */
  sendMessage: (content: string, conversationId: string) => void;
  /** Set the active conversation */
  setActiveConversation: (id: string) => void;
  /** Manually reconnect WebSocket */
  reconnect: () => void;
}

/**
 * Main chat hook for managing WebSocket connections and chat state.
 *
 * @param config - Chat configuration including WebSocket URL and user info
 * @returns Chat state and action methods
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isConnected } = useChat({
 *   wsUrl: 'wss://api.example.com/ws',
 *   userId: 'user-123',
 *   token: 'jwt-token',
 * });
 * ```
 */
export function useChat(config: ChatConfig): UseChatReturn {
  const {
    wsUrl,
    userId,
    token,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = config;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversation] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();

  /** Establish WebSocket connection */
  const connect = useCallback(() => {
    try {
      const url = token ? `${wsUrl}?token=${token}` : wsUrl;
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        console.log('[Chat] WebSocket connected');

        // Request initial data
        ws.send(JSON.stringify({ type: 'init', userId }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerMessage(data);
        } catch (err) {
          console.error('[Chat] Failed to parse message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('[Chat] WebSocket disconnected');

        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimerRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            console.log(
              `[Chat] Reconnecting (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
            );
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('[Chat] WebSocket error:', error);
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('[Chat] Connection failed:', err);
    }
  }, [wsUrl, userId, token, autoReconnect, reconnectInterval, maxReconnectAttempts]);

  /** Handle incoming server messages */
  const handleServerMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'conversations':
        setConversations(data.conversations);
        setIsLoading(false);
        break;

      case 'message':
        setMessages((prev) => [...prev, data.message as Message]);
        // Update conversation's last message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === data.message.conversationId
              ? { ...conv, lastMessage: data.message, updatedAt: new Date() }
              : conv
          )
        );
        break;

      case 'message_status':
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, status: data.status } : msg
          )
        );
        break;

      case 'history':
        setMessages((prev) => [...data.messages, ...prev]);
        break;

      default:
        console.warn('[Chat] Unknown message type:', data.type);
    }
  }, []);

  /** Send a message through WebSocket */
  const sendMessage = useCallback(
    (content: string, conversationId: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn('[Chat] WebSocket not connected');
        return;
      }

      const message: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        conversationId,
        senderId: userId,
        content,
        timestamp: new Date(),
        status: 'sending',
        type: 'text',
      };

      // Optimistic update
      setMessages((prev) => [...prev, message]);

      // Send to server
      wsRef.current.send(
        JSON.stringify({
          type: 'send_message',
          message,
        })
      );
    },
    [userId]
  );

  /** Force reconnect */
  const reconnect = useCallback(() => {
    wsRef.current?.close();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    setIsLoading(true);
    connect();

    return () => {
      clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return {
    messages,
    conversations,
    activeConversationId,
    isConnected,
    isLoading,
    sendMessage,
    setActiveConversation,
    reconnect,
  };
}