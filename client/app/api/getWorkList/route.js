import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  let status = body.status.split(',').map(status => status.trim());

  try {
    // Create parameterized placeholders based on the number of status values
    const statusPlaceholders = status.map((_, index) => `$${index + 2}`).join(',');

    let query = `
        SELECT DISTINCT
            rf."RF_Id",
            s.s_start_time,
            s.s_end_time,
            rp."RP_Status",
            rp."RP_Detail",
            rf."RF_Cause",
            rf."RF_Repair_details",
            rf."RF_Date",
            ac."AC_Serial",
            ac."AC_Model"
        FROM 
            "SCHEDULE" s
            LEFT JOIN "REQUEST_FORM" rf ON s."rf_id" = rf."RF_Id"
            LEFT JOIN "REQUEST_PROBLEM" rp ON rf."RF_Id" = rp."RP_Id"
            LEFT JOIN "AIRCONDITION" ac ON rp."AC_Serial" = ac."AC_Serial"
        WHERE 
            s.u_id = $1
        AND
            rp."RP_Status" IN (${statusPlaceholders})
        ORDER BY 
            s.s_start_time;
    `;

    const values = [body.id, ...status];

    const requestProblems = await db.query(query, values);

    return NextResponse.json(
      { requestProblems: requestProblems.rows },
      { status: 201 }
    );
  } catch (error) {
    console.error("Query Error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred", details: error.message },
      { status: 401 }
    );
  }
};