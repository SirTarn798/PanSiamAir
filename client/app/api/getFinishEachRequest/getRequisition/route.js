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
        ac."AC_Model",
        ac."AC_Installation_date"
      FROM 
        "REQUEST_PROBLEM" rp
      LEFT JOIN 
        "REQUEST_FORM" rf ON rp."RP_Id" = rf."RP_Id"
      LEFT JOIN 
        "AIRCONDITION" ac ON rp."AC_Serial" = ac."AC_Serial"
      JOIN
        "REQUISITION" r ON r."RF_Id" = rf."RF_Id"
    `;

    const requestProblems = await db.query(query);
    return NextResponse.json({ requestProblems: requestProblems.rows }, { status: 201 });
  } catch (error) {
    console.error("Query Error:", error);
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 401 });
  }
};
