import prismaDB from "@/lib/prisma.db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Params = {
  params: {
    companionId?: string;
  };
};

export const PATCH = async (req: Request, params: Params) => {
  const {
    params: { companionId },
  } = params;

  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;
    if (!companionId) {
      return new NextResponse("Missing companion ID", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !categoryId
    ) {
      return new NextResponse("Missing required field", { status: 400 });
    }

    //TODO check for subscription
    const companion = await prismaDB.companion.update({
      where: {
        id: companionId,
        userId: user.id,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });
    return NextResponse.json(companion);
  } catch (error) {
    console.log("[PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const DELETE = async (req: Request, params: Params) => {
  const {
    params: { companionId },
  } = params;

  try {
    const user = await currentUser();

    if (!companionId) {
      return new NextResponse("Missing companion ID", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //TODO check for subscription
    const companion = await prismaDB.companion.delete({
      where: {
        userId: user.id,
        id: companionId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
