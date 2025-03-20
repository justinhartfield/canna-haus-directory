
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl: string;
  fullName: string;
  size?: "sm" | "md" | "lg";
}

export const ProfileAvatar = ({ avatarUrl, fullName, size = "md" }: ProfileAvatarProps) => {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-20 w-20"
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={avatarUrl} alt={fullName || "User"} />
      <AvatarFallback>{getInitials(fullName || "User")}</AvatarFallback>
    </Avatar>
  );
};
