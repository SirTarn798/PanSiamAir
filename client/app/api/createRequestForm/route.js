import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
    const date = new Date();
    try {
        const body = await request.json();
        
        const query = `
            INSERT INTO "REQUEST_FORM" ("RP_Id", "RF_Date", "RF_EFT")
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const values = [parseInt(body.id), date, body.estimatedFixTimeMinutes];
        
        const result = await db.query(query, values);

        return NextResponse.json({ createdForm: result.rows[0] }, { status: 200 });
    } catch (error) {
        console.error('Detailed error:', error);
        
        if (error.code === '23505') {  // unique_violation
            return NextResponse.json(
                { error: "A REQUEST_FORM with this RP_Id already exists" },
                { status: 400 }
            );
        } else if (error.code === '23503') {  // foreign_key_violation
            return NextResponse.json(
                { error: "Related REQUEST_PROBLEM not found" },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: "Unexpected error occurred" },
            { status: 500 }
        );
    }
};