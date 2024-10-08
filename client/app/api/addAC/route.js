import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const temp = await request.json();
  const body = temp.ACData
  try {
    const query = `
      INSERT INTO "AIRCONDITION" 
        ("AC_Model", "AC_Serial", "AC_Store", "AC_Status", "AC_Address", "AC_Installation_date")
      VALUES 
        ($1, $2, $3, 'สถานะปกติ', $4, $5)
      RETURNING *;
    `;

    const values = [body.model, body.serial, body.store, body.address, body.date];
    await db.query(query, values);

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error("Insert Error:", error);
    return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
  }
};
