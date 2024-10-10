import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const GET = async (request) => {
  try {
    const query = `
      SELECT S_Date, S_Start_time, S_End_time
      FROM "SCHEDULE"
      ORDER BY S_Date, S_Start_time
    `;

    const result = await db.query(query);

    const appointments = result.rows.map(row => ({
      date: row.S_Date.toISOString(),
      start: row.S_Start_time.toISOString(),
      end: row.S_End_time.toISOString()
    }));

    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};