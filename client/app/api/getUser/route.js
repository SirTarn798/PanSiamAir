import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const result = await db.query(
      `
          SELECT * FROM "USER"
          WHERE "U_Email" = $1
          LIMIT 1
        `,
      [body.credential.email]
    );

    return NextResponse.json({ user: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "User not found" }, { status: 403 });
  }
};
