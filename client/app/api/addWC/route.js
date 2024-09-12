import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const temp = await request.json();
  const body = temp.ACData;
  body.date = new Date(body.date).toISOString();
  console.log(body)
  await prisma.WARRANTY_CARD.create({
    data: {
      WC_Model: body.model,
      WC_Serial: body.serial,
      C_ID: body.C_ID,
      WC_Store: "x",
      WC_Status: "สถานะปกติ",
      WC_Address: body.address,
      WC_Image_link: "x",
      WC_Installation_date: body.date,
      WC_Auth: false,
    },
  });
  return new NextResponse("The AC add request is submitted", { status: 201 });
};
