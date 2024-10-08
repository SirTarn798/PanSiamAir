import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const temp = await request.json();
  const body = temp.WCData;

  try {
    const query = `
      UPDATE "AIRCONDITION"
      SET 
        "AC_Image_link" = $1,
        "U_Id" = $2
      WHERE 
        "AC_Serial" = $3
        AND "AC_Model" = $4
      RETURNING *;
    `;
    const values = [body.wcPicLink, body.C_ID, body.serial, body.model];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "AC does not exist" }, { status: 400 });
    }

    return NextResponse.json(
      { msg: "The AC has been updated" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error code:", error.code);
    return NextResponse.json(
      { error: "Unexpected error happens" },
      { status: 500 }
    );
  }
};
