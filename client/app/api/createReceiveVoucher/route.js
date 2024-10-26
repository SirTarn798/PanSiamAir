import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  const selectedItems = body.selectedItems;
  const rf_id = body.rf_id;
  try {
    await db.query("BEGIN");

    const existingRFQuery = `
        SELECT * FROM "REQUEST_FORM"
        WHERE "RF_Id" = $1
    `
    const existingRFResult = await db.query(existingRFQuery, [rf_id]);
    if(existingRFResult.rows.length === 0) {
        return NextResponse.json({ error: "RF does not exist" }, { status: 400 });
    }

    const existingReceiveVoucherQuery = `
      SELECT "RV_Id" FROM "RECEIVE_VOUCHER" WHERE "RF_Id" = $1
    `;
    const existingReceiveVoucherResult = await db.query(
      existingReceiveVoucherQuery,
      [rf_id]
    );
    let receiveVoucherId;

    if (existingReceiveVoucherResult.rows.length === 0) {
      const createReceiveVoucherQuery = `
        INSERT INTO "RECEIVE_VOUCHER" ("RF_Id", "RV_Date") VALUES ($1, $2) RETURNING "RV_Id"
      `;
      const createReceiveVoucherResult = await db.query(
        createReceiveVoucherQuery,
        [rf_id, new Date()]
      );
      receiveVoucherId = createReceiveVoucherResult.rows[0].RV_Id;
    } else {
        return NextResponse.json({ error: "Already exist RV" }, { status: 400 });
    }

    const insertRSDQuery = `
        INSERT INTO "RECEIVE_VOUCHER_SPARE_DETAIL" ("RSD_Quantity", "S_Id", "RV_Id")
        VALUES ($1, $2, $3)
    `;
    for (const item of selectedItems) {
      await db.query(insertRSDQuery, [
        item.quantity,
        item.S_Id,
        receiveVoucherId,
      ]);
    }
    
    await db.query("COMMIT");
    return NextResponse.json({ status: 200 });
  } catch (error) {
    await db.query("ROLLBACK");
    console.log(error);
    return NextResponse.json({ error: "Failed to create RV" }, { status: 500 });
  }
};