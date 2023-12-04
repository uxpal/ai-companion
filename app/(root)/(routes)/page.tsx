import React from "react";

import { SearchInput } from "@/components/search-input";
import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";

import prismaDB from "@/lib/prisma.db";

type RootPageProps = {
  searchParams: {
    categoryId: string;
    name: string;
  };
};

const RootPage: React.FC<RootPageProps> = async ({ searchParams }) => {
  const data = await prismaDB.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: { search: searchParams.name },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
  const categories = await prismaDB.category.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  );
};

export default RootPage;
