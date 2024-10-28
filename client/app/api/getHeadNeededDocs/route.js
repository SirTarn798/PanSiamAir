import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const GET = async (request) => {
  const docs = { quotations: [] };

  try {
    const result = await db.query(`
      SELECT 
        rf."RF_Id",
        q."Q_Id",
        q."Q_Date",
        q."Q_Total",
        q."Q_Discount",
        q."Q_Vat",
        q."Q_Grand_total",
        json_agg(
          json_build_object(
            'Q_Id', sd."Q_Id",
            'S_Id', sd."S_Id",
            'SD_Quantity', sd."SD_Quantity"
          )
        ) AS "Spare_detail"
      FROM "REQUEST_PROBLEM" rp
      JOIN "REQUEST_FORM" rf ON rp."RP_Id" = rf."RP_Id"
      JOIN "QUOTATION" q ON rf."RF_Id" = q."RF_Id"
      LEFT JOIN "SPARE_DETAIL" sd ON q."Q_Id" = sd."Q_Id"
      WHERE rp."RP_Status" = 'accepted_wait_head_quotation'
      GROUP BY rf."RF_Id", q."Q_Id", q."Q_Date", q."Q_Total", q."Q_Discount", q."Q_Vat", q."Q_Grand_total"
    `);

    docs.quotations = result.rows.map(row => ({
      Request_form: {
        RF_Id: row.RF_Id,
        QUOTATION: {
          Q_Id: row.Q_Id,
          Q_Date: row.Q_Date,
          Q_Total: row.Q_Total,
          Q_Discount: row.Q_Discount,
          Q_Vat: row.Q_Vat,
          Q_Grand_total: row.Q_Grand_total,
          Spare_detail: row.Spare_detail
        }
      }
    }));

    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};