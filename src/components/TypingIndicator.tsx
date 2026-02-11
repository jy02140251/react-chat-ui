import React from "react";

interface TypingIndicatorProps {
  username?: string;
  avatarUrl?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ username, avatarUrl }) => {
  return (
    <div className="typing-indicator" style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
    }}>
      {avatarUrl && (
        <img src={avatarUrl} alt="" width={24} height={24}
          style={{ borderRadius: "50%" }} />
      )}
      <div style={{
        backgroundColor: "#e8e8e8", borderRadius: 18, padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        <span className="typing-dot" style={dotStyle(0)} />
        <span className="typing-dot" style={dotStyle(1)} />
        <span className="typing-dot" style={dotStyle(2)} />
      </div>
      {username && (
        <span style={{ fontSize: 12, color: "#888" }}>
          {username} is typing...
        </span>
      )}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .typing-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #999;
        }
      `}</style>
    </div>
  );
};

function dotStyle(index: number): React.CSSProperties {
  return {
    display: "inline-block",
    width: 7, height: 7, borderRadius: "50%",
    backgroundColor: "#999",
    animation: `typingBounce 1.4s infinite`,
    animationDelay: `${index * 0.2}s`,
  };
}

export default TypingIndicator;