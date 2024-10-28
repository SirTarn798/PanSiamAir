import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const GET = async (request) => {
  try {
    const query = `
        WITH RankedCauses AS (
            SELECT 
                a."AC_Model",
                rf."RF_Cause",
                COUNT(*) as cause_count,
                ROW_NUMBER() OVER (PARTITION BY a."AC_Model" ORDER BY COUNT(*) DESC) as cause_rank,
                COUNT(*) OVER (PARTITION BY a."AC_Model") as total_model_repairs
                FROM "REQUEST_FORM" rf
                JOIN "REQUEST_PROBLEM" rp ON rf."RP_Id" = rp."RP_Id"
                JOIN "AIRCONDITION" a ON rp."AC_Serial" = a."AC_Serial"
                WHERE rf."RF_Cause" IS NOT NULL
                GROUP BY a."AC_Model", rf."RF_Cause"
            )
        SELECT 
            "AC_Model",
            total_model_repairs as "Total Repairs",
            "RF_Cause" as "Cause",
            cause_count as "Cause Count",
            ROUND((cause_count::numeric / total_model_repairs * 100)::numeric, 2) as "Cause Percentage",
            'Top ' || cause_rank as "Rank"
        FROM RankedCauses
        WHERE cause_rank <= 5
        ORDER BY "AC_Model", cause_rank;
    `;

    const data = await db.query(query);
    const causes = data.rows;

    return NextResponse.json({ causes }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Some error occurred (Possibly DB)", {
      status: 500,
    });
  }
};
