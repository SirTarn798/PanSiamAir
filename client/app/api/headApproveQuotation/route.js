import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();

  try {
    if (body.status) {
      // Update QUOTATION and related tables
      await db.query(
        `
        UPDATE "QUOTATION"
        SET "Q_Manager_stauts" = true
        WHERE "RF_Id" = $1
      `,
        [body.rf_id]
      );

      await db.query(
        `
        UPDATE "REQUEST_PROBLEM"
        SET "RP_Status" = 'accepted_wait_cus_quotation'
        WHERE "RP_Id" = (
          SELECT "RP_Id"
          FROM "REQUEST_FORM"
          WHERE "RF_Id" = $1
        )
      `,
        [body.rf_id]
      );

      await db.query(
        `
        UPDATE "AIRCONDITION"
        SET "AC_Status" = 'รอยืนยันราคา'
        WHERE "AC_Serial" = (
          SELECT "AC_Serial"
          FROM "REQUEST_PROBLEM"
          WHERE "RP_Id" = (
            SELECT "RP_Id"
            FROM "REQUEST_FORM"
            WHERE "RF_Id" = $1
          )
        )
      `,
        [body.rf_id]
      );
    } else {
      // Update REQUEST_PROBLEM status
      await db.query(
        `
        UPDATE "REQUEST_PROBLEM"
        SET "RP_Status" = 'accepted_wait_write_quotation'
        WHERE "RP_Id" = (
          SELECT "RP_Id"
          FROM "REQUEST_FORM"
          WHERE "RF_Id" = $1 
        )
      `,
        [body.id]
      );

      // Delete related SPARE_DETAIL entries
      await db.query(
        `
        DELETE FROM "SPARE_DETAIL"
        WHERE "Q_Id" = (
          SELECT "Q_Id"
          FROM "QUOTATION"
          WHERE "RF_Id" = $1
        )
      `,
        [body.rf_id]
      );
    }

    return NextResponse.json({ message: "Update successful" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
