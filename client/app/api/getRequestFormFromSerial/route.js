import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const query = `
        SELECT 
            rf."RF_Id",
            rp."RP_Id"
        FROM 
            "REQUEST_FORM" rf
        JOIN 
            "REQUEST_PROBLEM" rp ON rf."RP_Id" = rp."RP_Id"
        JOIN 
            "AIRCONDITION" ac ON rp."AC_Serial" = ac."AC_Serial"
        WHERE 
            ac."AC_Serial" = $1
            AND rp."RP_Status" LIKE 'accepted%'
    `;

    const values = [body.serial];
    const result = await db.query(query, values);
    if (result.rows.length > 0) {
      return NextResponse.json({ requests : result.rows[0] }, { status: 200 });
    } else {
      throw new Error("Can't find Request Form");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
