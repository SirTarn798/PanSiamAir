import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  try {
    const body = await request.json();

    const ac = await prisma.aIRCONDITION.update({
      where: {
        U_Id: body.id,
        AC_Serial: body.serial,
      },
      data: {
        AC_Status: "รอพิจารณาซ่อม",
      },
    });

    if (!ac) {
      return NextResponse.json({ error: "AC does not exist" }, { status: 400 });
    }

    await prisma.rEQUEST_PROBLEM.create({
      data: {
        AC: {
          connect: {
            AC_Serial: body.serial,
          },
        },
        RP_Detail: body.detail,
        RP_Status : "waiting"
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
