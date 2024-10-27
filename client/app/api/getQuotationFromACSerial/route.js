import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const result = await db.query(
        `SELECT 
        q."Q_Id",
        q."Q_Date",
        q."Q_Total",
        q."Q_Discount",
        q."Q_Vat",
        q."Q_Grand_total",
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
      FROM "QUOTATION" q
      LEFT JOIN "SPARE_DETAIL" sd ON q."Q_Id" = sd."Q_Id"
      LEFT JOIN "SPARE" s ON sd."S_Id" = s."S_Id"
      LEFT JOIN "REQUEST_FORM" rf on q."RF_Id" = rf."RF_Id"
      LEFT JOIN "REQUEST_PROBLEM" rp on rf."RP_Id" = rp."RP_Id"
      LEFT JOIN "AIRCONDITION" ac on rp."AC_Serial" = ac."AC_Serial"
      WHERE ac."AC_Serial" = $1
      GROUP BY q."Q_Id", q."Q_Date", q."Q_Total", q."Q_Discount", q."Q_Vat", q."Q_Grand_total"`,
      [(body.serial)]
    );

    if (result.rows.length > 0) {
      const quotation = result.rows[0];
      return NextResponse.json({ quotation }, { status: 200 });
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
