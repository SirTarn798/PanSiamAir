import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();

  try {

    if (body.status) {
      // Update QUOTATION and related tables
      await db.query(`
        UPDATE "QUOTATION"
        SET "Q_Manager_stauts" = true
        WHERE "Q_Id" = $1
      `, [body.id]);

      await db.query(`
        UPDATE "REQUEST_PROBLEM"
        SET "RP_Status" = 'accpeted_wait_cus_quotation'
        WHERE "RP_Id" = (
          SELECT "RP_Id"
          FROM "REQUEST_FORM"
          WHERE "RF_Id" = (
            SELECT "RF_Id"
            FROM "QUOTATION"
            WHERE "Q_Id" = $1
          )
        )
      `, [body.id]);
    } else {
      // Update REQUEST_PROBLEM status
      await db.query(`
        UPDATE "REQUEST_PROBLEM"
        SET "RP_Status" = 'accepted_wait_write_quotation'
        WHERE "RP_Id" = (
          SELECT "RP_Id"
          FROM "REQUEST_FORM"
          WHERE "RF_Id" = (
            SELECT "RF_Id"
            FROM "QUOTATION"
            WHERE "Q_Id" = $1
          )
        )
      `, [body.id]);

      // Delete related SPARE_DETAIL entries
      await db.query(`
        DELETE FROM "SPARE_DETAIL"
        WHERE "Q_Id" = $1
      `, [body.id]);
    }

    return NextResponse.json({ message: "Update successful" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};