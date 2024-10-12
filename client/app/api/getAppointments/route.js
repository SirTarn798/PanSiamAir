import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const GET = async (request) => {
  try {
    const query = `
      SELECT S_Start_time, S_End_time
      FROM "SCHEDULE"
      ORDER BY S_Start_time
    `;

    const result = await db.query(query);
    const appointments = result.rows.map(row => ({
      start: row.s_start_time.toISOString(),
      end: row.s_end_time.toISOString()
    }));

    return NextResponse.json(appointments);
  } catch (error) {
    // console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};