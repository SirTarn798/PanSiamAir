import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  const { selectedItems, RF_Id, discount, insurance } = body;

  try {
    await db.query('BEGIN');

    // Check if a quotation with the given RF_Id already exists
    const existingQuotationQuery = `
      SELECT "Q_Id" FROM "QUOTATION" WHERE "RF_Id" = $1
    `;
    const existingQuotationResult = await db.query(existingQuotationQuery, [RF_Id]);
    let quotationId;

    if (existingQuotationResult.rows.length === 0) {
      // Create the new quotation if it doesn't exist
      const createQuotationQuery = `
        INSERT INTO "QUOTATION" ("RF_Id") VALUES ($1) RETURNING "Q_Id"
      `;
      const createQuotationResult = await db.query(createQuotationQuery, [RF_Id]);
      quotationId = createQuotationResult.rows[0].Q_Id;
    } else {
      quotationId = existingQuotationResult.rows[0].Q_Id;
    }

    // Insert spare details
    const insertSpareDetailQuery = `
      INSERT INTO "SPARE_DETAIL" ("Q_Id", "S_Id", "SD_Quantity") VALUES ($1, $2, $3)
    `;
    for (const item of selectedItems) {
      await db.query(insertSpareDetailQuery, [quotationId, item.S_Id, item.quantity]);
    }

    // Calculate totals
    let totalPrice = selectedItems.reduce((acc, item) => acc + (item.S_Price * item.quantity), 0);
    if(insurance) {
      totalPrice = 0;
    }
    const discountAmount = parseFloat(discount) || 0;
    const vat = 0.07 * (totalPrice - discountAmount);
    const grandTotal = totalPrice - discountAmount + vat;

    // Update the quotation with calculated totals
    const updateQuotationQuery = `
      UPDATE "QUOTATION" 
      SET "Q_Total" = $1, "Q_Discount" = $2, "Q_Vat" = $3, "Q_Grand_total" = $4, "Q_Date" = $5
      WHERE "Q_Id" = $6
      RETURNING *
    `;
    const updatedQuotationResult = await db.query(updateQuotationQuery, [
      totalPrice, discountAmount, vat, grandTotal, new Date(), quotationId
    ]);

    // Fetch the Request_Problem related to the Request_Form
    const requestFormQuery = `
      SELECT rp."RP_Id" 
      FROM "REQUEST_FORM" rf
      JOIN "REQUEST_PROBLEM" rp ON rf."RP_Id" = rp."RP_Id"
      WHERE rf."RF_Id" = $1
    `;
    const requestFormResult = await db.query(requestFormQuery, [RF_Id]);
    const rpId = requestFormResult.rows[0].RP_Id;

    // Update the status of the Request_Problem
    const updateRequestProblemQuery = `
      UPDATE "REQUEST_PROBLEM" 
      SET "RP_Status" = 'accepted_wait_head_quotation'
      WHERE "RP_Id" = $1
    `;
    await db.query(updateRequestProblemQuery, [rpId]);

    await db.query('COMMIT');

    return NextResponse.json({ createdQuotation: updatedQuotationResult.rows[0] }, { status: 200 });
  } catch (error) {
    await db.query('ROLLBACK');
    console.log(error);
    if (error.constraint === 'quotation_rf_id_key') {
      return NextResponse.json({ error: "Existing RF_Id" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 });
  }
};