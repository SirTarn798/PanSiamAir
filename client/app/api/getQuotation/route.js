import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();
    return NextResponse.json({res : "xdd"}, {status: 201})
};
