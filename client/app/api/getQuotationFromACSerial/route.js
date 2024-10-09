import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const result = await db.query(
        `WITH request_problem AS (
            SELECT *
            FROM "REQUEST_PROBLEM"
            WHERE "AC_Serial" = $1
            AND "RP_Status" LIKE 'accepted%'
            ORDER BY "RP_Id" DESC
            LIMIT 1
        ) SELECT json_build_object(
            'quotation', json_build_object(
                'Q_Id', q."Q_Id",
                'Q_Customer_stauts', q."Q_Customer_stauts",
                'Q_Manager_stauts', q."Q_Manager_stauts",
                'Q_Total', q."Q_Total",
                'Q_Discount', q."Q_Discount",
                'Q_Vat', q."Q_Vat",
                'Q_Grand_total', q."Q_Grand_total",
                'Q_Date', q."Q_Date"
            ),
            'Spare_detail', COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'S_Id', s."S_Id",
                        'S_Name', s."S_Name",
                        'S_Price', s."S_Price",
                        'SD_Quantity', sd."SD_Quantity"
                    )
                )
                FROM "SPARE_DETAIL" sd
                JOIN "SPARE" s ON sd."S_Id" = s."S_Id"
                WHERE sd."Q_Id" = q."Q_Id"
                ), '[]'::json
            )
        ) AS result
        FROM request_problem rp
        JOIN "REQUEST_FORM" rf ON rp."RP_Id" = rf."RP_Id"
        JOIN "QUOTATION" q ON rf."RF_Id" = q."RF_Id";`,
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
