import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const query = `
        UPDATE "RECEIVE_VOUCHER"
        SET "RV_Approve" = true
        WHERE "RV_Id" = $1
    `
    const result = await db.query(query, [body.rv_id]);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};