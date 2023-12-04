import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";

type BotAvatarProps = {
  src: string;
};
export const BotAvatar: React.FC<BotAvatarProps> = ({ src }) => {
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={src} alt="Companion Avatar" />
    </Avatar>
  );
};