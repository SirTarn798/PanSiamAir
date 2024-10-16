import { NextResponse } from "next/server";
import db from "@/lib/dbA";
import { error } from "console";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const result = await db.query(`
      SELECT 
        re."RE_Id",
        re."RE_Date",
        json_agg(
          json_build_object(
            'SD_Quantity', sd."SD_Quantity",
            'Spare', json_build_object(
              'S_Id', s."S_Id",
              'S_Name', s."S_Name",
              'S_Price', s."S_Price"
            )
          )
        ) AS "Spare_detail"
      FROM "REQUISITION" re
      JOIN "REQUEST_FORM" rf on re."RF_Id" = rf."RF_Id"
      JOIN "QUOTATION" q on rf."RF_Id" = q."RF_Id" 
      LEFT JOIN "SPARE_DETAIL" sd ON q."Q_Id" = sd."Q_Id"
      LEFT JOIN "SPARE" s ON sd."S_Id" = s."S_Id"
      WHERE rf."RF_Id" = $1
      GROUP BY re."RE_Id", re."RE_Date"
    `, [(body.rf_id)]);

    if (result.rows.length > 0) {
      const requisition = result.rows[0];
      return NextResponse.json({ requisition }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "หมายเลขไอดีไม่ถูกต้อง" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "เซิร์ฟเวอร์มีปัญหา กรุณาลองอีกครั้ง" },
      { status: 500 }
    );
  }
};