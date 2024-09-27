import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  try {
    const body = await request.json();

    const ac = await prisma.aIRCONDITION.update({
      where: {
        AC_Serial: body.serial,
      },
      data: {
        AC_Status: body.status,
      },
    });

    if(body.status === "สถานะปกติ") {
        await prisma.rEQUEST_PROBLEM.update({
            where : {
                RP_Id : body.id
            },
            data: {
                RP_Status : "rejected"
            }
        })
    }
    else {
        await prisma.rEQUEST_PROBLEM.update({
            where : {
                RP_Id : body.id
            },
            data: {
                RP_Status : "accepted"
            }
        })
    }

    if (!ac) {
      return NextResponse.json({ error: "AC does not exist" }, { status: 400 });
    }
    return NextResponse.json({}, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
