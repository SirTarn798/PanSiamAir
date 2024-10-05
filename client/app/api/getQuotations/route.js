import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const requestProblems = await prisma.rEQUEST_PROBLEM.findMany({
      where: {
        RP_Status: body.type,
      },
      include: {
        Request_form: true,
        AC: {
          select: {
            AC_Serial: true,
            AC_Model: true,
          },
        },
      },
    });
    return NextResponse.json({requestProblems}, {status:201})
  } catch (error) {
    return NextResponse.json({error} , {status:401})
  }
};
