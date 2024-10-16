import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const GET = async (request) => {
  try {
    const query = `
      SELECT S_Start_time, S_End_time, U_Id
      FROM "SCHEDULE"
      WHERE S_Start_time > CURRENT_TIMESTAMP
      ORDER BY S_Start_time
    `;

    const result = await db.query(query);
    const appointments = result.rows.map(row => ({
      start: row.s_start_time.toISOString(),
      end: row.s_end_time.toISOString(),
      u_id : row.u_id
    }));

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
