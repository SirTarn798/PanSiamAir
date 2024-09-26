import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

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
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Request not found" }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Unexpected error happens" },
        { status: 500 }
      );
    }
  }
};
