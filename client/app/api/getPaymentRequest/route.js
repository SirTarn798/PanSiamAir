import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const query = `
        SELECT *
        FROM "PAYMENT_REQUEST"
        WHERE "RF_Id" = $1
    `;
    const values = [parseInt(body.rf_id)];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      return NextResponse.json({ request : result.rows[0] }, { status: 201 });
    } else {
      throw new Error("Can't find Request Form");
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
