import { logout } from "../../../lib/auth";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  logout()
  return new NextResponse({status: 201})
};
