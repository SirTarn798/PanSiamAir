import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const query = `
      SELECT q."Q_Id"
        FROM "QUOTATION" q
        WHERE q."RF_Id" = $1;
    `;

    const values = [body.rf_id];
    const response = await db.query(query, values);
    const q_id = response.rows[0].Q_Id

    const getQuotation = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getQuotation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: q_id }),
      }
    );

    const data = await getQuotation.json();

    return NextResponse.json(
      { quotation: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Query Error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 401 }
    );
  }
};
