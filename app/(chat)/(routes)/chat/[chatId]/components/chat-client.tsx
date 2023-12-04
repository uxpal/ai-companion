"use client";

import React, { useState } from "react";

import { Companion, Message } from "@prisma/client";

import { ChatHeader } from "@/components/chat-header";
import { ChatForm } from "@/components/chat-form";
import { ChatMessages } from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";

import { useRouter } from "next/navigation";

import { useCompletion } from "ai/react";

type ChatClientProps = {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
};

const ChatClient: React.FC<ChatClientProps> = ({ companion }) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages,
  );
  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onFinish(prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };

        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        messages={messages}
        isLoading={isLoading}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={(e) => {
          const userMessage: ChatMessageProps = {
            role: "user",
            content: input,
          };

          setMessages((current) => [...current, userMessage]);
          handleSubmit(e);
        }}
      />
    </div>
  );
};

export default ChatClient;
