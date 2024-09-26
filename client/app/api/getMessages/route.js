import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const id = body.id;
  const data = await prisma.mESSAGE.findMany({
    where: {
      OR: [{ M_Sender: id }, { M_Receiver: id }],
    },
  });

  const chat = {
    messages: data,
  };

  return NextResponse.json(chat);
};
