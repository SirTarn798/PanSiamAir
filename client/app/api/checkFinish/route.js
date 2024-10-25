import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  try {
    const body = await request.json();    
    let query;
    let values;
    let result;

    if (body.from === "finance") {
      query = `
        SELECT *
        FROM "RECEIVE_VOUCHER"
        WHERE "RF_Id" = $1
        AND "RV_Approve" = true
      `;
      values = [body.rf_id];
    } else if (body.from === "store") {
      query = `
        SELECT *
        FROM "RECEIPT"
        WHERE "RF_Id" = $1
      `;
      values = [body.rf_id];
    }

    // Check if the query and values are set before executing the query
    if (query && values) {
      result = await db.query(query, values);

      if (result.rows?.length > 0) {
        return NextResponse.json({ status: 201 });
      } else {
        return NextResponse.json({error : "The work is not finished"},{ status: 403 });
      }
    } else {
      console.error("Query or values are not defined");
      return NextResponse.json({ status: 400, error: "Bad request" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json({ status: 500, error: "Internal server error" });
  }
};
