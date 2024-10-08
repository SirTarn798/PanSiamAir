import { NextResponse } from "next/server";
import db from "@/lib/dbA";
import { hash } from "bcryptjs";

export const POST = async (request) => {
  const body = await request.json();
  const hashedPassword = await hash(body.password, 10);

  try {
    const insertUserQuery = `
      INSERT INTO "USER" ("U_Email", "U_Password", "U_Role", "U_Tel", "U_Name", "U_Profile") 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await db.query(insertUserQuery, [
      body.email,
      hashedPassword,
      body.role,
      body.tel,
      body.name,
      body.profile,
    ]);
    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};
