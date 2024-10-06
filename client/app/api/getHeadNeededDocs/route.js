import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const GET = async (request) => {
  const docs = { quotations: []}; // Add more object here if needed...

  try {
    const quotations = await prisma.rEQUEST_PROBLEM.findMany({
      where: {
        RP_Status: "accepted_wait_leader_quotation",
      },
      select: {
        Request_form: {
          select: {
            RF_Id: true,
            QUOTATION: {
              select: {
                Spare_detail: true,
                Q_Id: true,
                Q_Date: true,
                Q_Total: true,
                Q_Discount: true,
                Q_Vat: true,
                Q_Grand_total: true,
              },
            },
          },
        },
      },
    });

    // Push the data to the appropriate arrays within the docs object
    docs.quotations.push(...quotations);
    
    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
