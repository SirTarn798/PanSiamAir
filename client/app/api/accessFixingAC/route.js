import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  try {
    const body = await request.json();

    const acQuery = `
      SELECT * 
      FROM "AIRCONDITION"
      WHERE "U_Id" = $1
        AND "AC_Serial" = $2
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
        AND "RP_Status" <> 'finished'
      LIMIT 1
    `;
    const reqValues = [body.serial];
    const reqResult = await db.query(reqQuery, reqValues);

    if (reqResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Request is still pending" },
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
