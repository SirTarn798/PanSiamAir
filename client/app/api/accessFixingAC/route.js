import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  try {
    const body = await request.json();
    
    const ac = await prisma.wARRANTY_CARD.findUnique({
      where: {
        C_ID: body.id,
        WC_Serial: body.serial,
      },
    });

    const req = await prisma.request.findFirst({
      where : {
        WC_Serial: body.serial, // This should be body.serial since it refers to WC_Serial
        Status: {
          not : "finished",
        },
      },
    });

    if (!ac) {
      // If AC doesn't exist
      return NextResponse.json({ error: "AC does not exist" }, { status: 400 });
    }

    if (req) {
      // If a request with WC_Serial exists and is not finished
      return NextResponse.json({ error: "Request is still pending" }, { status: 400 });
    }

    return NextResponse.json({ ac }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
