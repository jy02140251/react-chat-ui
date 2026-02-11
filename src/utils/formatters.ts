/**
 * Utility functions for formatting chat messages and timestamps.
 */

export function formatTimestamp(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatMessageTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function highlightMentions(text: string): string {
  return text.replace(
    /@(\w+)/g,
    '<span class="mention" style="color:#1976d2;font-weight:500">@$1</span>'
  );
}

export function linkifyUrls(text: string): string {
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  return text.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#1976d2">$1</a>'
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function getMessagePreview(content: string, maxLength = 50): string {
  const stripped = content.replace(/<[^>]*>/g, "").trim();
  return truncateText(stripped, maxLength);
}