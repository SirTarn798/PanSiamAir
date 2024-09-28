import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { error } from "console";

export const POST = async (request) => {
  const body = await request.json();

  try {
    const requests = await prisma.rEQUEST_PROBLEM.findUnique({
      where: {
        RP_Id: body.id,
      },
      include: {
        AC: {
          include: {
            Customer: true,
          },
        },
      },
    });
    if(!requests) {
      return NextResponse.json({error : "Can't find request"}, {status: 400})
    }
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error happens" },
      { status: 500 }
    );
  }
};