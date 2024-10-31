import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();

  try {
    const query = `
WITH spare_details AS (
    SELECT 
        q."RF_Id",
        string_agg(
            concat(
                s."S_Name", 
                ' (Quantity: ', sd."SD_Quantity", 
                ', Price: ', s."S_Price", 
                ', Total: ', (sd."SD_Quantity" * s."S_Price"), 
                ')'
            ),
            E'\n'
        ) as spare_parts_details,
        sum(sd."SD_Quantity" * s."S_Price") as total_spare_parts_cost
    FROM 
        public."QUOTATION" q
        INNER JOIN public."SPARE_DETAIL" sd ON q."Q_Id" = sd."Q_Id"
        INNER JOIN public."SPARE" s ON sd."S_Id" = s."S_Id"
    GROUP BY 
        q."RF_Id"
)
SELECT DISTINCT
    r."RC_Id" as receipt_id,
    r."RC_Date" as receipt_date,
    u."U_Name" as customer_name,
    ac."AC_Serial" as aircondition_serial,
    ac."AC_Model" as aircondition_model,
    rp."RP_Detail" as problem_detail,
    rf."RF_Cause" as repair_cause,
    rf."RF_Repair_details" as repair_details,
    COALESCE(sd.spare_parts_details, 'No spare parts used') as spare_parts_details,
    COALESCE(sd.total_spare_parts_cost, 0) as spare_parts_cost,
    q."Q_Total" as subtotal,
    q."Q_Discount" as discount,
    q."Q_Vat" as vat,
    q."Q_Grand_total" as total_amount
FROM 
    public."USER" u
    INNER JOIN public."AIRCONDITION" ac ON u."U_Id" = ac."U_Id"
    INNER JOIN public."REQUEST_PROBLEM" rp ON ac."AC_Serial" = rp."AC_Serial"
    INNER JOIN public."REQUEST_FORM" rf ON rp."RP_Id" = rf."RP_Id"
    INNER JOIN public."RECEIPT" r ON rf."RF_Id" = r."RF_Id"
    LEFT JOIN public."QUOTATION" q ON rf."RF_Id" = q."RF_Id"
    LEFT JOIN spare_details sd ON rf."RF_Id" = sd."RF_Id"
WHERE 
    u."U_Id" = $1
ORDER BY 
    r."RC_Date" DESC;
    `
    const result = await db.query(query, [body.id]);
    return NextResponse.json({receipts : result.rows},{ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};