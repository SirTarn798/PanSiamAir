import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();
  try {
    const rf = await prisma.rEQUEST_FORM.findFirst({
      where: {
        RF_Id: body.RF_Id,
      },
      include: {
        Request_problem: {
          select: {
            AC: {
                select : {
                    Customer : {
                        select : {
                            U_Name : true
                        }
                    },
                    AC_Address : true,
                    AC_Model : true,
                    AC_Serial : true,
                }
            }
          },
        },
      },
    });
    if (rf) {
      return NextResponse.json({rf},{ status: 200 });
    } else {
      throw new Error("Can't find Request Form");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
