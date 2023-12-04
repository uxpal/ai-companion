import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";

type UserAvatarProps = any;

export const UserAvatar: React.FC<UserAvatarProps> = () => {
  const { user } = useUser();

  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={user?.imageUrl} alt="Companion Avatar" />
    </Avatar>
  );
};
