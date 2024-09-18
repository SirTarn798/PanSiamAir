import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const temp = await request.json();
  const body = temp.ACData;
  body.date = new Date(body.date).toISOString();
  await prisma.WARRANTY_CARD.create({
    data: {
      WC_Model: body.model,
      WC_Serial: body.serial,
      WC_Store: body.store,
      WC_Status: "สถานะปกติ",
      WC_Address: body.address,
      WC_Installation_date: body.date,
    },
  });
  return new NextResponse("The AC add request is submitted", { status: 201 });
};
