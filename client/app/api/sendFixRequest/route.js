import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  try {
    const body = await request.json();

    // Update AIRCONDITION
    const acResult = await db.query(`
      UPDATE "AIRCONDITION"
      SET "AC_Status" = 'รอพิจารณาซ่อม'
      WHERE "U_Id" = $1 AND "AC_Serial" = $2
      RETURNING *
    `, [body.id, body.serial]);

    if (acResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return NextResponse.json({ error: "AC does not exist" }, { status: 400 });
    }

    const ac = acResult.rows[0];

    // Create REQUEST_PROBLEM
    await db.query(`
      INSERT INTO "REQUEST_PROBLEM" ("AC_Serial", "RP_Detail", "RP_Status")
      VALUES ($1, $2, $3)
    `, [body.serial, body.detail, "waiting"]);

    return NextResponse.json({ ac }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};