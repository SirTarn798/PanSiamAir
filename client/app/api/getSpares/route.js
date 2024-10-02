import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const GET = async (request) => {
    try {
        const spares = await prisma.sPARE.findMany({});
        return NextResponse.json({ spares }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};
