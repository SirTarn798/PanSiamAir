import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const temp = await request.json();
  const body = temp.WCData
  try {
    const wc = await prisma.aIRCONDITION.update({
      where: {
        AC_Serial: body.serial,
        AC_Model: body.model,
      },
      data: {
        AC_Image_link: body.wcPicLink,
        U_Id: body.C_ID,
      },
    });
    return NextResponse.json(
      { msg: "The AC has been updated" },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "AC does not exist" }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Unexpected error happens" },
        { status: 500 }
      );
    }
  }
};
