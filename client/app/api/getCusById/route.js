import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
    const body = await request.json();

    try {
        const user = await prisma.uSER.findUnique({
            where: {
                U_Id: body.cusId
            },
            select: {
                U_Id: true,
                U_Name: true,
                U_Email: true,
                U_Profile : true,
                U_Tel : true
            }
        });
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};
