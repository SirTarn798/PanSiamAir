import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export const POST = async (request) => {
  const body = await request.json();
  const { selectedItems, RF_Id } = body;

  try {
    const createdQuotation = await prisma.$transaction(async (prisma) => {
      // Create the new quotation
      const newQuotation = await prisma.qUOTATION.create({
        data: {
          RF_Id,
        },
      });

      // Prepare spare details for the quotation
      const spareDetails = selectedItems.map((item) => ({
        Q_Id: newQuotation.Q_Id,
        S_Id: item.S_Id,
        SD_Quantity: item.quantity,
      }));

      // Insert the spare details
      await prisma.sPARE_DETAIL.createMany({
        data: spareDetails,
      });

      // Calculate total price, discount, VAT, and grand total
      const totalPrice = selectedItems.reduce((acc, item) => {
        return acc + (item.S_Price * item.quantity);
      }, 0);

      const discount = body.Q_Discount || 0;
      const vat = 0.07 * (totalPrice - discount);
      const grandTotal = totalPrice - discount + vat;

      // Update the quotation with calculated totals
      const updatedQuotation = await prisma.qUOTATION.update({
        where: { Q_Id: newQuotation.Q_Id },
        data: {
          Q_Total: totalPrice,
          Q_Discount: discount,
          Q_Vat: vat,
          Q_Grand_total: grandTotal,
        },
      });

      // Fetch the Request_Problem related to the Request_Form using the RF_Id
      const requestForm = await prisma.rEQUEST_FORM.findUnique({
        where: { RF_Id },
        include: { Request_problem: true }, // Fetch the related Request_problem
      });

      // Update the status of the Request_Problem
      await prisma.rEQUEST_PROBLEM.update({
        where: {
          RP_Id: requestForm.Request_problem.RP_Id,  // Use the fetched RP_Id
        },
        data: {
          RP_Status: "accepted_wait_leader_quotation",  // You can change this to the desired status
        },
      });

      return updatedQuotation;
    });

    return NextResponse.json({ createdQuotation }, { status: 200 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Existing RF_Id" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 });
  }
};
