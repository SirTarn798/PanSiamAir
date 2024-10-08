import db from "@/lib/dbA"; // Ensure this is your SQL connection file
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const id = body.id;

  try {
    // SQL Query to fetch messages where the user is either the sender or the receiver
    const query = `
      SELECT * FROM "MESSAGE" 
      WHERE "M_Sender" = $1 OR "M_Receiver" = $1
    `;
    
    const { rows } = await db.query(query, [id]);

    const chat = {
      messages: rows, // Assuming your SQL driver returns the result in "rows"
    };

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
  }
};
