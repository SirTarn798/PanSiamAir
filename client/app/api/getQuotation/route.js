import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const quotation = await prisma.qUOTATION.findUnique({
      where: {
        Q_Id: body.id,
      },
      select: {
        Q_Id: true,
        Q_Date: true,
        Q_Total: true,
        Q_Discount: true,
        Q_Vat: true,
        Q_Grand_total: true,
        Spare_detail: {
          select: {
            SD_Quantity: true,
            Spare: true,
          },
        },
      },
    });
    if (quotation) {
      return NextResponse.json({ quotation }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "หมายเลขไอดีไม่ถูกต้อง" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "เซิร์ฟเวอร์มีปัญหา กรุณาลองอีกครั้ง" },
      { status: 500 }
    );
  }
};
