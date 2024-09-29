import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  try {
    const body = await request.json();
    await prisma.aIRCONDITION.update({
      where: {
        AC_Serial: body.serial,
      },
      data: {
        AC_Status: body.statusAc,
      },
    });

    await prisma.rEQUEST_PROBLEM.update({
      where: {
        RP_Id: body.id,
      },
      data: {
        RP_Status: body.statusRp,
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
