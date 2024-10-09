import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const GET = async (request) => {
    try {
        const result = await db.query(`
            SELECT * FROM "SPARE"
        `);

        const spares = result.rows;

        return NextResponse.json({ spares }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};