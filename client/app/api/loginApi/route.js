import { signIn } from "../../../lib/auth";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  const data = await signIn(body);
  if (data) {
    return NextResponse.json({ user: data }, { status: 201 });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
};
