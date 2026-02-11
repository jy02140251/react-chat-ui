import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_CATEGORIES: Record<string, string[]> = {
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "😘", "😗", "😋", "😛", "😜", "🤪", "😝"],
  "Gestures": ["👋", "🤚", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👍", "👎", "👏", "🙌"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️"],
  "Objects": ["🔔", "📱", "💻", "🖥️", "📷", "📹", "🎵", "🎶", "🎤", "🎧", "📚", "✏️", "📝", "📎", "🔑", "🔒", "💡", "📦", "🎁", "🏆"],
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("Smileys");
  const [searchTerm, setSearchTerm] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleEmojiClick = useCallback(
    (emoji: string) => {
      onSelect(emoji);
    },
    [onSelect]
  );

  const filteredEmojis = useMemo(() => {
    return EMOJI_CATEGORIES[activeCategory] || [];
  }, [activeCategory]);

  if (!isOpen) return null;

  return (
    <div ref={pickerRef} className="emoji-picker" style={{
      position: "absolute", bottom: "100%", left: 0, width: 320,
      backgroundColor: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      padding: 12, zIndex: 100,
    }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 8, overflowX: "auto" }}>
        {Object.keys(EMOJI_CATEGORIES).map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{
              padding: "4px 10px", borderRadius: 16, border: "none", cursor: "pointer",
              fontSize: 12, backgroundColor: cat === activeCategory ? "#e3f2fd" : "transparent",
              color: cat === activeCategory ? "#1976d2" : "#666", whiteSpace: "nowrap",
            }}>
            {cat}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
        {filteredEmojis.map((emoji, i) => (
          <button key={i} onClick={() => handleEmojiClick(emoji)}
            style={{
              fontSize: 22, background: "none", border: "none", cursor: "pointer",
              padding: 4, borderRadius: 6, transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;