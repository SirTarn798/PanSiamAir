import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const data = body.data;
  try {
    await db.query("BEGIN");

    const query = `
        INSERT INTO "PAYMENT_REQUEST"("PR_Pic", "PR_Name", "PR_Bank", "PR_Price", "PR_Date", "RF_Id")
        VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      body.pic,
      data.name,
      data.bank,
      data.price,
      data.dateTime,
      body.rf_id,
    ];
    await db.query(query, values);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: body.rp_id,
        serial: body.serial,
        statusAc: "ซ่อมสำเร็จ รอกระบวนการเสร็จสิ้น",
        statusRp: "accepted_wait_finance_approve_payment",
      }),
    });

    await db.query("COMMIT");
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    await db.query("ROLLBACK");
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
