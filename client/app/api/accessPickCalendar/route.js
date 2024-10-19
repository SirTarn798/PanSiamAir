import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  try {
    const body = await request.json();

    const acQuery = `
      SELECT rf."RF_EFT" 
      FROM "AIRCONDITION" ac
      JOIN
        "REQUEST_PROBLEM" rp on ac."AC_Serial" = rp."AC_Serial"
      JOIN
        "REQUEST_FORM" rf on rp."RP_Id" = rf."RP_Id"
      WHERE ac."U_Id" = $1
        AND ac."AC_Serial" = $2
    `;
    const acValues = [body.id, body.serial];
    const acResult = await db.query(acQuery, acValues);

    if (acResult.rows.length === 0) {
      return NextResponse.json({ error: "AC does not exist" }, { status: 400 });
    }

    const reqQuery = `
      SELECT * 
      FROM "REQUEST_PROBLEM"
      WHERE "AC_Serial" = $1
        AND "RP_Status" = 'accepted_wait_pick_calendar' 
        OR "RP_Status" = 'accepted_fail_wait_reschedule' 
      LIMIT 1
    `;

    const reqValues = [body.serial];
    const reqResult = await db.query(reqQuery, reqValues);

    if (reqResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Can't pick calendar" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ac: acResult.rows[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
