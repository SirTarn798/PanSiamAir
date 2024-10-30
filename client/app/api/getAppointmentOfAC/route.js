import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
    const body = await request.json()
  try {
    const query = `
        SELECT s.s_end_time, s.s_start_time
        FROM "SCHEDULE" s
        JOIN "REQUEST_FORM" rf ON s.rf_id = rf."RF_Id"
        JOIN "REQUEST_PROBLEM" rp ON rf."RP_Id" = rp."RP_Id"
        JOIN "AIRCONDITION" ac on rp."AC_Serial" = ac."AC_Serial"
        WHERE rp."RP_Status" IN ('accepted_wait_fixing', 'accepted_wait_write_requisition', 'accepted_wait_write_distribute_voucher', 'accepted_wait_approve_distribute_voucher')
        AND ac."AC_Serial" = $1;
    `;
    const data = await db.query(query, [body.AC_Serial]);
    const appointment = data.rows;

    return NextResponse.json({ appointment }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Some error occurred (Possibly DB)", {
      status: 500,
    });
  }
};
