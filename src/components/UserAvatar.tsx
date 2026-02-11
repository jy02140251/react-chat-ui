import React, { useMemo } from "react";

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
};

const colorPalette = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  imageUrl,
  size = "md",
  online,
  className = "",
}) => {
  const dimension = sizeMap[size];
  const bgColor = useMemo(() => getColorFromName(name), [name]);
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <div className={`user-avatar ${className}`} style={{ position: "relative" }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          width={dimension}
          height={dimension}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: dimension,
            height: dimension,
            borderRadius: "50%",
            backgroundColor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
            fontSize: dimension * 0.4,
          }}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: online ? "#4CAF50" : "#9E9E9E",
            border: "2px solid #fff",
          }}
        />
      )}
    </div>
  );
};

export default UserAvatar;