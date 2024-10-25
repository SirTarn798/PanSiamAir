import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  let query;
  let values;
  let result;
  try {
    if (body.from === "finance") {
      query = `
        SELECT *
        FROM "RECEIVE_VOUCHER"
        WHERE "RF_Id" = $1
        AND "RV_Status" = true
    `;
      values = [body.rf_id];
      result = await db.query(query, values);
    } else if (body.from === "store") {
      query = `
            SELECT *
            FROM "RECEIPT"
            WHERE "RF_Id" = $1
        `;
      values = [body.rf_id];
      result = await db.query(query, values);
    }
    if (result.rows.length > 0) {
      return NextResponse.json({ status: 201 });
    } else {
      return NextResponse.json({ status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: "User not found" }, { status: 403 });
  }
};
