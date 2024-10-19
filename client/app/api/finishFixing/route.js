import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();

  try {

    let query = `
        UPDATE "REQUEST_FORM" SET
        "RF_Cause" = $1,
        "RF_Repair_details" = $2
        WHERE "RF_Id" = $3
    `;

    const values = [body.cause, body.fixDetail, body.rf_id];

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