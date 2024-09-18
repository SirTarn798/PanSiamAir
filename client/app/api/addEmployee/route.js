import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const temp = await request.json();
  const body = temp.userData;
  await prisma.User.create({
    data: {
     
    },
  });
  return new NextResponse("The AC add request is submitted", { status: 201 });
};
