import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
    const date = new Date();
    try {
    const body = await request.json();
    await prisma.rEQUEST_FORM.create({
        data : {
            RP_Id : body.id,
            RF_Date : date
        }
    })

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
