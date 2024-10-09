import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  const acSerial = body.serial;
  const acStatus = body.status ? "รอเลือกวันนัดหมาย" : "สถานะปกติ";
  const rpStatus = body.status ? "accepted_wait_pick_calendar" : "rejected";
  const qCustomerStatus = body.status;

  try {
    await db.query("BEGIN");

    // Update AC_Status in AIRCONDITION table
    const updateAC = `
      UPDATE "AIRCONDITION"
      SET "AC_Status" = $2
      WHERE "AC_Serial" = $1
    `;
    await db.query(updateAC, [acSerial, acStatus]);

    // Update RP_Status in REQUEST_PROBLEM table
    const updateRP = `
      WITH latest_request AS (
          SELECT "RP_Id"
          FROM "REQUEST_PROBLEM"
          WHERE "AC_Serial" = $1
          ORDER BY "RP_Id" DESC
          LIMIT 1
      )
      UPDATE "REQUEST_PROBLEM"
      SET "RP_Status" = $2
      WHERE "RP_Id" = (SELECT "RP_Id" FROM latest_request)
    `;
    const rpResult = await db.query(updateRP, [acSerial, rpStatus]);

    // Update Q_Customer_status in QUOTATION table
    const updateQ = `
      WITH latest_request AS (
          SELECT "RP_Id"
          FROM "REQUEST_PROBLEM"
          WHERE "AC_Serial" = $1
          ORDER BY "RP_Id" DESC
          LIMIT 1
      ),
      linked_form AS (
          SELECT "RF_Id"
          FROM "REQUEST_FORM"
          WHERE "RP_Id" = (SELECT "RP_Id" FROM latest_request)
      )
      UPDATE "QUOTATION"
      SET "Q_Customer_stauts" = $2
      WHERE "RF_Id" = (SELECT "RF_Id" FROM linked_form)
      RETURNING *
    `;
    const qResult = await db.query(updateQ, [acSerial, qCustomerStatus]);

    await db.query("COMMIT");

    // Check if all updates occurred
    const allUpdatesOccurred = rpResult.rowCount > 0 && qResult.rowCount > 0;

    if (allUpdatesOccurred) {
      return NextResponse.json(
        { 
          message: "All statuses updated successfully",
          updatedQuotation: qResult.rows[0]
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          message: "Some updates may not have occurred",
          rpUpdated: rpResult.rowCount > 0,
          qUpdated: qResult.rowCount > 0
        },
        { status: 200 }
      );
    }
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error in update operation:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
};