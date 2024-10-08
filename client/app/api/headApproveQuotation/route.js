import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();
  try {
    if (body.status) {
      await prisma.qUOTATION.update({
        where: {
          Q_Id: parseInt(body.id),
        },
        data: {
          Q_Manager_stauts: true,
          Request_form: {
            update: {
              Request_problem: {
                update: {
                  RP_Status: "accpeted_wait_cus_quotation",
                },
              },
            },
          },
        },
      });
    } else {
      await prisma.qUOTATION.update({
        where: {
          Q_Id: parseInt(body.id),
        },
        data: {
          Request_form: {
            update: {
              Request_problem: {
                update: {
                  RP_Status: "accepted_wait_write_quotation",
                },
              },
            },
          },
        },
      });
      await prisma.sPARE_DETAIL.deleteMany({
        where: {
          Q_Id: parseInt(body.id),
        },
      });
    }
    return NextResponse.json({ message: "Update successful" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
