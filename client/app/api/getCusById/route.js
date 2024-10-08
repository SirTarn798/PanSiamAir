import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const userQuery = `
      SELECT "U_Id", "U_Name", "U_Email", "U_Profile", "U_Tel" 
      FROM "USER" 
      WHERE "U_Id" = $1
    `;

    const rows = await db.query(userQuery, [body.cusId]);
    return NextResponse.json({ user: rows.rows }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
};
