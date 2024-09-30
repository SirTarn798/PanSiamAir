import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const requestProblems = await prisma.rEQUEST_PROBLEM.findMany({
      where: {
        RP_Status: body.type, // Filter by the status
      },
      include: {
        Request_form: true, // Include the related Request_form
        AC: {
          select: {
            AC_Serial: true, // Select the AC_Serial
            AC_Model: true, // Select the AC_Model
          },
        },
      },
    });
    return NextResponse.json({requestProblems}, {status:201})
  } catch (error) {
    return NextResponse.json({error} , {status:401})
  }
};
