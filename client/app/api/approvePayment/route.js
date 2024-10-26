import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  const rp_id = body.rp_id;
  try {
    if (body.status) {
      const query = `
        INSERT INTO "RECEIPT"("RC_Date", "RF_Id")
        VALUES
        ($1, $2)
    `;
      const values = [new Date(), body.rf_id];
      await db.query(query, values);

      let statusAc, statusRp;
      statusAc = "สถานะปกติ";
      statusRp = "finished";

      const updateRequest = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/updateRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: rp_id,
            serial: body.serial,
            statusAc,
            statusRp,
          }),
        }
      );
    } else {
      const query = `
            DELETE FROM "PAYMENT_REQUEST" WHERE "RF_Id" = $1
        `;
      const values = [body.rf_id];
      await db.query(query, values);
      const updateRequest = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/updateRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: rp_id,
            serial: body.serial,
            statusAc: "อัปโหลดหลักฐานการชำระเงิน",
            statusRp: "accepted_wait_upload_payment",
          }),
        }
      );
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "" }, { status: 400 });
  }
};
