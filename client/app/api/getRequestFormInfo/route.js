import { NextResponse } from "next/server";
import db from "@/lib/dbA";

export const POST = async (request) => {
  const body = await request.json();

  try {
    const result = await db.query(`
      SELECT 
        rp.*,
        rf.*,
        ac."AC_Model",
        json_build_object(
          'U_Id', u."U_Id",
          'U_Email', u."U_Email",
          'U_Tel', u."U_Tel",
          'U_Name', u."U_Name",
          'U_Role', u."U_Role",
          'U_Profile', u."U_Profile"
        ) AS "Customer"
      FROM "REQUEST_PROBLEM" rp
      LEFT JOIN "AIRCONDITION" ac ON rp."AC_Serial" = ac."AC_Serial"
      LEFT JOIN "USER" u ON ac."U_Id" = u."U_Id"
      LEFT JOIN "REQUEST_FORM" rf on rp."RP_Id" = rf."RP_Id"
      WHERE rf."RF_Id" = $1
    `, [(body.id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({error: "Can't find request"}, {status: 400});
    }

    const requests = result.rows[0];

    // Restructure the data
    const restructuredRequests = {
      ...requests,
      AC: {
        ...requests,
        Customer: requests.Customer
      }
    };

    // Remove duplicate keys
    delete restructuredRequests.Customer;
    Object.keys(restructuredRequests.AC).forEach(key => {
      if (key.startsWith('RP_')) {
        delete restructuredRequests.AC[key];
      }
    });

    return NextResponse.json({ requests: restructuredRequests }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Unexpected error happens" },
      { status: 500 }
    );
  }
};