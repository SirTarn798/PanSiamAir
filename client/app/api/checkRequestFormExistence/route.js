import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();

  try {
    const query = `
      SELECT 
        rf.*,
        ac."AC_Address",
        ac."AC_Model",
        ac."AC_Serial",
        u."U_Name"
      FROM 
        "REQUEST_FORM" rf
      JOIN 
        "REQUEST_PROBLEM" rp ON rf."RP_Id" = rp."RP_Id"
      JOIN 
        "AIRCONDITION" ac ON rp."AC_Serial" = ac."AC_Serial"
      JOIN 
        "USER" u ON ac."U_Id" = u."U_Id"
      WHERE 
        rf."RF_Id" = $1;
    `;

    const values = [body.RF_Id];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return NextResponse.json({ rf: result.rows[0] }, { status: 200 });
    } else {
      throw new Error("Can't find Request Form");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
