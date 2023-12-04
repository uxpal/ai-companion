"use client";

import React from "react";

import { Companion, Message } from "@prisma/client";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import { BotAvatar } from "./bot-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useToast } from "./ui/use-toast";

import { useUser } from "@clerk/nextjs";

import { useRouter } from "next/navigation";

import axios from "axios";

type ChatHeaderProps = {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({ companion }) => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            router.back();
          }}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <BotAvatar src={companion.src} />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{companion.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="w-3 h-3 mr-1" />
              {companion._count.messages}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Created by {companion.userName}
          </p>
        </div>
      </div>
      {user?.id === companion.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                router.push(`/companion/${companion.id}`);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await axios.delete(`/api/companion/${companion.id}`);

                  toast({
                    description: "Success",
                  });
                  router.refresh();
                  router.push("/");
                } catch (error) {
                  toast({
                    variant: "destructive",
                    description: "Oops something went wrong!",
                  });
                }
              }}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
