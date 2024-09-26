import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const acs = await prisma.aIRCONDITION.findMany({
      where: {
        U_Id: body.id,
      },
    });
    return NextResponse.json({acs: acs}, {status: 201})
  } catch (err) {
    return new NextResponse("Some error occured(Possibly DB)", {status: 401})
  }
};
