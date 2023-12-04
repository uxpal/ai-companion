import prismaDB from "@/lib/prisma.db";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ChatClient from "./components/chat-client";

type ChatIdPageProps = {
  params: {
    chatId: string;
  };
};

const ChatIdPage: React.FC<ChatIdPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }
  const companion = await prismaDB.companion.findUnique({
    where: { id: params.chatId },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!companion) {
    return redirect("/");
  }

  return <ChatClient companion={companion} />;
};

export default ChatIdPage;
