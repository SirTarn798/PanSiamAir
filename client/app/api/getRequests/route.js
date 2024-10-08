import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
    const body = await request.json();
    try {
        const result = await db.query(`
            SELECT 
                rp.*,
                json_build_object(
                    'AC_Serial', ac."AC_Serial",
                    'AC_Model', ac."AC_Model",
                    'U_Id', ac."U_Id",
                    'AC_Store', ac."AC_Store",
                    'AC_Status', ac."AC_Status",
                    'AC_Address', ac."AC_Address",
                    'AC_Image_link', ac."AC_Image_link",
                    'AC_Installation_date', ac."AC_Installation_date",
                    'Customer', json_build_object(
                        'U_Id', u."U_Id",
                        'U_Email', u."U_Email",
                        'U_Tel', u."U_Tel",
                        'U_Name', u."U_Name",
                        'U_Role', u."U_Role",
                        'U_Profile', u."U_Profile"
                    )
                ) AS "AC"
            FROM "REQUEST_PROBLEM" rp
            LEFT JOIN "AIRCONDITION" ac ON rp."AC_Serial" = ac."AC_Serial"
            LEFT JOIN "USER" u ON ac."U_Id" = u."U_Id"
            WHERE rp."RP_Status" LIKE $1 || '%'
        `, [body.type]);

        const requests = result.rows.map(row => ({
            ...row,
            AC: {
                ...row.AC,
                Customer: row.AC.Customer
            }
        }));

        return NextResponse.json({ requests }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};