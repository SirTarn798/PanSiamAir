import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();
  try {
    await prisma.sPARE.create({
      data: {
        S_Name: body.spareData.name,
        S_Price: parseFloat(body.spareData.price),
      },
    });
    return new NextResponse("เพิ่มอะไหล่สำเร็จ", { status: 201 });
  } catch (err) {
    if (err.code === "P2002") {
      return new NextResponse("ชื่อของอะไหล่นั้นมีอยู่แล้ว โปรดใช้ชื่ออื่น", {
        status: 400,
      });
    }
    console.log(err.code);
    return new NextResponse("ขออภัย เซิร์ฟเวอร์มีข้อผิดพลาด โปรดลองอีกครั้ง", {
      status: 500,
    });
  }
};
