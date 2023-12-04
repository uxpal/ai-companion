import React from "react";

import prismaDB from "@/lib/prisma.db";

import { CompanionForm } from "./components/companion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

type CompanionIdPageProps = {
  params: {
    companionId: string;
  };
};

const CompanionIdPage: React.FC<CompanionIdPageProps> = async ({ params }) => {
  const { userId } = auth();
  //TODO check subscription

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismaDB.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });

  const categories = await prismaDB.category.findMany();

  return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
