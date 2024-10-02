import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const temp = await request.json();
  const body = temp.ACData;
  body.date = new Date(body.date).toISOString();
  await prisma.aIRCONDITION.create({
    data: {
      AC_Model: body.model,
      AC_Serial: body.serial,
      AC_Store: body.store,
      AC_Status: "สถานะปกติ",
      AC_Address: body.address,
      AC_Installation_date: body.date,
    },
  });
  return new NextResponse("The AC add request is submitted", { status: 201 });
};
