import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const date = new Date();
  try {
    const body = await request.json();

    const insertQuery = `
      INSERT INTO "DISTRIBUTE_VOUCHER" ("DV_Date", "RF_Id")
      VALUES ($1, $2)
      RETURNING *;
    `;
    const insertValues = [date, (body.rf_id)];
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
      SET "RP_Status" = 'accepted_wait_approve_distribute_voucher'
      FROM SelectedRecords sr
      WHERE rp."RP_Id" = sr."RP_Id";
    `;
    const updateValues = [(body.rf_id)];
    await db.query(updateQuery, updateValues);

    return NextResponse.json({ createdForm: insertResult.rows[0] }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
  }
};
