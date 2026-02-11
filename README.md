# React Chat UI

Modern React + TypeScript chat UI component library with customizable themes and real-time messaging support.

## Features

- TypeScript First with full type safety
- Light/Dark theme support via CSS custom properties
- WebSocket integration hook for real-time messaging
- Responsive mobile-first design
- ARIA accessible components

## Installation

```bash
npm install react-chat-ui
```

## Quick Start

```tsx
import { ChatWindow, useChat } from 'react-chat-ui';
import 'react-chat-ui/styles/chat.css';

function App() {
  const { messages, sendMessage, conversations } = useChat({
    wsUrl: 'wss://your-server.com/ws',
    userId: 'user-123',
  });

  return (
    <ChatWindow
      messages={messages}
      conversations={conversations}
      onSendMessage={sendMessage}
      currentUserId="user-123"
    />
  );
}
```

## Components

- ChatWindow - Full chat interface
- MessageBubble - Individual message display
- MessageInput - Text input with send
- ConversationList - Sidebar with search

## License

MIT