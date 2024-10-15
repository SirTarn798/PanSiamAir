import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const date = new Date();
  try {
    const body = await request.json();

    // First, execute the INSERT statement
    const insertQuery = `
      INSERT INTO "REQUISITION" ("RE_Date", "Q_Id", "RF_Id")
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const insertValues = [date, parseInt(body.q_id), parseInt(body.rf_id)];
    const insertResult = await db.query(insertQuery, insertValues);

    // Then, execute the UPDATE statement
    const updateQuery = `
      WITH SelectedRecords AS (
        SELECT rp."RP_Id"
        FROM "REQUEST_FORM" rf
        JOIN "REQUEST_PROBLEM" rp ON rf."RP_Id" = rp."RP_Id"
        WHERE rf."RF_Id" = $1
      )
      UPDATE "REQUEST_PROBLEM" rp
      SET "RP_Status" = 'accepted_wait_write_distribute_voucher'
      FROM SelectedRecords sr
      WHERE rp."RP_Id" = sr."RP_Id";
    `;
    const updateValues = [parseInt(body.rf_id)];
    await db.query(updateQuery, updateValues);

    // Return the inserted data
    return NextResponse.json({ createdForm: insertResult.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
  }
};
