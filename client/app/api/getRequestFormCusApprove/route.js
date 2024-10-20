import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const query = `
        SELECT 
            ac.*,
            rf.*,
            rp."RP_Id"
        FROM "AIRCONDITION" ac
        LEFT JOIN "REQUEST_PROBLEM" rp on rp."AC_Serial" = ac."AC_Serial"
        LEFT JOIN "REQUEST_FORM" rf on rp."RP_Id" = rf."RP_Id"
        WHERE ac."AC_Serial" = $1
        AND ac."U_Id" = $2
    `;

    const values = [body.serial, body.id];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      return NextResponse.json({ request : result.rows[0] }, { status: 200 });
    } else {
      throw new Error("Can't find Request Form");
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
