import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  try {
    const body = await request.json();

    // Start a transaction
    await db.query('BEGIN');

    // Update AIRCONDITION
    await db.query(`
      UPDATE "AIRCONDITION"
      SET "AC_Status" = $1
      WHERE "AC_Serial" = $2
    `, [body.statusAc, body.serial]);

    // Update REQUEST_PROBLEM
    await db.query(`
      UPDATE "REQUEST_PROBLEM"
      SET "RP_Status" = $1
      WHERE "RP_Id" = $2
    `, [body.statusRp, parseInt(body.id)]);

    // Commit the transaction
    await db.query('COMMIT');

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    // Rollback the transaction in case of error
    await db.query('ROLLBACK');
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};