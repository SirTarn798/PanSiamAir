import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const GET = async (request) => {
  try {
    const query = `
      SELECT "U_Name", "U_Id"
      FROM "USER"
      WHERE "U_Role" = 'MECHANIC'
    `;

    const result = await db.query(query);

    return NextResponse.json({mechList : result.rows}, {status:200});
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
