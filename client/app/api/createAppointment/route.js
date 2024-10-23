import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const body = await request.json();

  try {
    const getRequestFormResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getRequestFormFromSerial`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serial: body.serial,status :"accepted" }),
      }
    );

    let data = await getRequestFormResponse.json();
    const rf_id = data.requests.RF_Id;
    const rp_id = data.requests.RP_Id;
    const slotDate = new Date(body.slot);
    const u_id = body.u_id;

    // Calculate start time (assuming you still want to add 7 hours)
    const startDate = new Date(slotDate.getTime());

    // Calculate end time
    const durationInMs = body.duration * 60 * 1000;
    const endDate = new Date(startDate.getTime() + durationInMs);

    if (body.reschedule) {
      const query = `
      UPDATE "SCHEDULE" SET
      S_Start_time = $1,
      S_End_time = $2
      WHERE Rf_Id = $3
      `;
      const values = [startDate, endDate, rf_id];
      const result = await db.query(query, values);

      const updateRequest = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/updateRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: rp_id,
            serial: body.serial,
            statusAc: "อยู่ในขั้นตอนการซ่อม",
            statusRp: "accepted_wait_fixing",
          }),
        }
      );

      if (result.rows.length > 0) {
        return NextResponse.json({}, { status: 200 });
      } else {
        throw new Error("Failed to insert new schedule entry");
      }
    } else {
      // Ensure slotDate is valid before proceeding
      if (isNaN(slotDate.getTime())) {
        throw new Error("Invalid slot date provided");
      }

      const values = [rf_id, startDate, endDate, u_id];

      const query = `
        INSERT INTO "SCHEDULE" (rf_id, S_Start_time, S_End_time, U_Id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;

      const result = await db.query(query, values);
      const updateRequest = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/updateRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: rp_id,
            serial: body.serial,
            statusAc: "อยู่ในขั้นตอนการซ่อม",
            statusRp: "accepted_wait_write_requisition",
          }),
        }
      );
      data = await updateRequest.json();

      const updateQuery = `
      UPDATE "REQUEST_FORM"
      SET "Mech_Id" = $1
      WHERE "RF_Id" = $2
    `;

      const updateValues = [u_id, rf_id];

      const updateResult = await db.query(updateQuery, updateValues);

      if (result.rows.length > 0 && updateResult.rows.length > 0) {
        return NextResponse.json({}, { status: 200 });
      } else {
        throw new Error("Failed to insert new schedule entry");
      }
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
