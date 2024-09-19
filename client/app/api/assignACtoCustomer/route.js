import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const temp = await request.json();
  const body = temp.WCData
  try {
    const wc = await prisma.WARRANTY_CARD.update({
      where: {
        WC_Serial: body.serial,
        WC_Model: body.model,
      },
      data: {
        WC_Image_link: body.wcPicLink,
        C_ID: body.C_ID,
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
