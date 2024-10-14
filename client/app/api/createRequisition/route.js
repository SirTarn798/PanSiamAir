import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const date = new Date();
  try {
    const body = await request.json();

    const query = `
            INSERT INTO "REQUISITION" ("RE_Date", "Q_Id", "RF_Id")
            VALUES ($1, $2, $3)

            WITH SelectedRecords AS (
                SELECT 
                rp."RP_Id"
                    FROM 
                        "REQUEST_FORM" rf
                    JOIN 
                        "REQUEST_PROBLEM" rp ON rf."RP_Id" = rp."RP_Id"
                    WHERE 
                        rf."RF_Id" = $3
            )
            UPDATE "REQUEST_PROBLEM" rp
            SET 
                "RP_Status" = 'accepted_wait_make_distribute_voucher'
            FROM SelectedRecords sr
            WHERE 
                rp."RP_Id" = sr.RP_Id;

        `;
    const values = [date, parseInt(body.q_id), parseInt(body.rf_id)];
    const result = await db.query(query, values);

    return NextResponse.json({ createdForm: result.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
