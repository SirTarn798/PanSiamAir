import prisma from "../../../lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
export const POST = async (request) => {
  const body = await request.json();
  const hashedPassword = await hash(body.password, 10);
  try {
    await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }

  return new NextResponse("User has been created", {
    status: 201,
  });
};
