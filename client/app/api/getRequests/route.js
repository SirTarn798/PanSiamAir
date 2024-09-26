import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
    const body = await request.json();

    try {
        const requests = await prisma.rEQUEST_PROBLEM.findMany({
            where: {
                RP_Status: body.type,
            },
            include: {
                AC: {
                    include: {
                        Customer: true,
                    },
                },
            },
        });

        return NextResponse.json({ requests }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};
