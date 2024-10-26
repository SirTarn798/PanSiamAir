import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();

  try {
    const query = `
        SELECT rv.*,
        json_agg(
          json_build_object(
            'SD_Quantity', rsd."RSD_Quantity",
            'Spare', json_build_object(
              'S_Id', s."S_Id",
              'S_Name', s."S_Name",
              'S_Price', s."S_Price"
            )
          )
        ) AS "Spare_detail"
        FROM "RECEIVE_VOUCHER" rv
        LEFT JOIN "RECEIVE_VOUCHER_SPARE_DETAIL" rsd on rv."RV_Id" = rsd."RV_Id"
        LEFT JOIN "SPARE" s on rsd."S_Id" = s."S_Id" 
        WHERE "RV_Approve" = $1
        GROUP BY rv."RV_Date", rv."RF_Id", rv."RV_Approve", rv."RV_Id"
    `
    const result = await db.query(query, [body.type]);
    return NextResponse.json({receiveVouchers : result.rows},{ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};