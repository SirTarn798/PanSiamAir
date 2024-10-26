import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  try {
    let query = `
      SELECT 
        rp.*, 
        rf.*, 
        ac."AC_Serial", 
        ac."AC_Model"
      FROM 
        "REQUEST_PROBLEM" rp
      LEFT JOIN 
        "REQUEST_FORM" rf ON rp."RP_Id" = rf."RP_Id"
      LEFT JOIN 
        "AIRCONDITION" ac ON rp."AC_Serial" = ac."AC_Serial"
      WHERE 
        rp."RP_Status" LIKE $1
    `;

    const values = [`${body.type}%`];

    if (body.mech_id) {
      query += ` AND rf."Mech_Id" = $2`;
      values.push(body.mech_id);
    }

    const requestProblems = await db.query(query, values);
    return NextResponse.json({ requestProblems: requestProblems.rows }, { status: 201 });
  } catch (error) {
    console.error("Query Error:", error);
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 401 });
  }
};
