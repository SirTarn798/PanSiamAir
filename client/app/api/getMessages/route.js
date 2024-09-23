import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const id = body.id;
  const data = await prisma.message.findMany({
    where: {
      OR: [{ sender: id }, { receiver: id }],
    },
  });

  const chat = {
    messages: data,
  };

  return NextResponse.json(chat);
};
