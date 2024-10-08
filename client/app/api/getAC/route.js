import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();

  try {
    const getACsQuery = `
      SELECT * FROM "AIRCONDITION"
      WHERE "U_Id" = $1
    `;

    const data = await db.query(getACsQuery, [body.id]);
    const acs = data.rows

    return NextResponse.json({ acs }, { status: 200 }); 
  } catch (err) {
    console.error(err); // Log the error for debugging
    return new NextResponse("Some error occurred (Possibly DB)", { status: 500 }); 
  }
};
