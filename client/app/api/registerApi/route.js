import prisma from "../../../lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
export const POST = async (request) => {
  const body = await request.json();
  const hashedPassword = await hash(body.password, 10);
  try {
    await prisma.uSER.create({
      data: {
        U_Email: body.email,
        U_Password: hashedPassword,
        U_Role: body.role,
        U_Tel: body.tel,
        U_Name: body.name,
        U_Profile: body.profile
      },
    });
  } catch (err) {
    console.log(err.message)
    return new NextResponse(err.message, {
      status: 500,
    });
  }

  return new NextResponse("User has been created", {
    status: 201,
  });
};
