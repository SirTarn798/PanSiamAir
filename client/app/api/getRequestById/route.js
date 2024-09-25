import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();

  try {
    const requests = await prisma.request.findUnique({
      where: {
        id: body.id,
      },
      include: {
        WC: {
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
