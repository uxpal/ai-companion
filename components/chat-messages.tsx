import { Companion } from "@prisma/client";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { ChatMessage, ChatMessageProps } from "./chat-message";

type ChantMessagesProps = {
  messages?: ChatMessageProps[];
  isLoading?: boolean;
  companion: Companion;
};

export const ChatMessages: React.FC<ChantMessagesProps> = ({
  messages = [],
  isLoading,
  companion,
}) => {
  const scrollRef = useRef<ElementRef<"div">>(null);
  const [fakeLoading, setFakeLoading] = useState(messages.length === 0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        src={companion.src}
        role="system"
        content={`Hello, I am ${companion.name}, ${companion.description}`}
      />
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          role={message.role}
          content={message.content}
          src={companion.src}
        />
      ))}
      {isLoading && <ChatMessage role="system" src={companion.src} isLoading />}
      <div ref={scrollRef} />
    </div>
  );
};
