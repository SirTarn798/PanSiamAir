import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const query = `
      INSERT INTO "SPARE" ("S_Name", "S_Price")
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [body.spareData.name, parseFloat(body.spareData.price)];

    await db.query(query, values);

    return new NextResponse("เพิ่มอะไหล่สำเร็จ", { status: 201 });
  } catch (err) {
    if (err.code === "23505") {  // PostgreSQL unique violation error code
      return new NextResponse("ชื่อของอะไหล่นั้นมีอยู่แล้ว โปรดใช้ชื่ออื่น", {
        status: 400,
      });
    }
    console.log("Error code:", err.code);
    return new NextResponse("ขออภัย เซิร์ฟเวอร์มีข้อผิดพลาด โปรดลองอีกครั้ง", {
      status: 500,
    });
  }
};
