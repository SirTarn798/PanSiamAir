import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const query = `
        SELECT pr.*, rp."RP_Id", ac."AC_Serial"
        FROM "PAYMENT_REQUEST" pr
        JOIN "REQUEST_FORM" rf ON pr."RF_Id" = rf."RF_Id"
        JOIN "REQUEST_PROBLEM" rp ON rf."RP_Id" = rp."RP_Id"
        JOIN "AIRCONDITION" ac ON rp."AC_Serial" = ac."AC_Serial"
        WHERE pr."RF_Id" = $1
        AND pr."PR_Status" = false
    `;
    const values = [parseInt(body.rf_id)];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      return NextResponse.json({ request: result.rows[0] }, { status: 201 });
    } else {
      throw new Error("Can't find Request Form");
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};