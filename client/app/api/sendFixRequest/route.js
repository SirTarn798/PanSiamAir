import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  try {
    const body = await request.json();

    const ac = await prisma.wARRANTY_CARD.update({
      where: {
        C_ID: body.id,
        WC_Serial: body.serial,
      },
      data: {
        WC_Status: "รอพิจารณาซ่อม",
      },
    });

    if (!ac) {
      return NextResponse.json({ error: "AC does not exist" }, { status: 400 });
    }

    await prisma.request.create({
      data: {
        WC: {
          connect: {
            WC_Serial: body.serial,
          },
        },
        Detail: body.detail,
      },
    });

    return NextResponse.json({ ac }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
