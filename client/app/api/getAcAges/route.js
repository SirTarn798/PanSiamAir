import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const GET = async (request) => {
  try {
    const query = `
        WITH RepairTimes AS (
            SELECT 
                a."AC_Model",
                a."AC_Installation_date",
                MIN(rf."RF_Date") as first_repair_date,
                COUNT(DISTINCT rf."RF_Id") as total_repairs,
                EXTRACT(EPOCH FROM (rf."RF_Date" - a."AC_Installation_date"))/86400 as days_to_repair
            FROM "AIRCONDITION" a
            JOIN "REQUEST_PROBLEM" rp ON a."AC_Serial" = rp."AC_Serial"
            JOIN "REQUEST_FORM" rf ON rp."RP_Id" = rf."RP_Id"
            GROUP BY a."AC_Serial", a."AC_Model", a."AC_Installation_date", rf."RF_Date"
        )
        SELECT 
            "AC_Model",
            COUNT(DISTINCT days_to_repair) as "Number of Repairs",
            ROUND(AVG(days_to_repair)::numeric, 2) as "Average Days Until Repair",
            ROUND(MIN(days_to_repair)::numeric, 2) as "Minimum Days Until Repair",
            ROUND(MAX(days_to_repair)::numeric, 2) as "Maximum Days Until Repair",
            ROUND(AVG(days_to_repair)/365::numeric, 2) as "Average Years Until Repair"
        FROM RepairTimes
        GROUP BY "AC_Model"
        ORDER BY "Average Days Until Repair" DESC;
    `;

    const data = await db.query(query);
    const ages = data.rows;

    return NextResponse.json({ ages }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Some error occurred (Possibly DB)", {
      status: 500,
    });
  }
};
