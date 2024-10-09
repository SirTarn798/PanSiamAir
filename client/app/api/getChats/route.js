import db from "@/lib/dbA";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    // Step 1: Fetch all messages
    const messagesQuery = `
      SELECT * FROM "MESSAGE"
    `;
    const messages = await db.query(messagesQuery);

    // Step 2: Group messages by userId (sender and receiver), skipping "services"
    const groupedMessages = messages.rows.reduce((acc, message) => {
      // Add messages where the user is the sender (but skip if sender is "services")
      if (message.M_Sender !== "services") {
        if (!acc[message.M_Sender]) {
          acc[message.M_Sender] = [];
        }
        acc[message.M_Sender].push(message);
      }

      // Add messages where the user is the receiver (but skip if receiver is "services")
      if (message.M_Receiver !== "services") {
        if (!acc[message.M_Receiver]) {
          acc[message.M_Receiver] = [];
        }
        acc[message.M_Receiver].push(message);
      }

      return acc;
    }, {});

    // Step 3: Fetch user details (name and profile URL) for all userIds in groupedMessages
    const userIds = Object.keys(groupedMessages).map(id => id.trim()); // Make sure to trim any whitespace
    // Ensure userIds are treated as UUID
    const usersQuery = `
      SELECT "U_Id", "U_Name", "U_Profile" FROM "USER"
      WHERE "U_Id" = ANY($1::uuid[])
    `;
    const users = await db.query(usersQuery, [userIds]);

    // Step 4: Enhance groupedMessages with user details (name and profile_url)
    const result = userIds.reduce((acc, userId) => {
      const user = users.rows.find((u) => u.U_Id === userId);
      if (user) {
        acc[userId] = {
          user: {
            name: user.U_Name,
            profile: user.U_Profile,
          },
          messages: groupedMessages[userId], // Attach grouped messages
        };
      }
      return acc;
    }, {});

    return NextResponse.json(result);
  } catch (err) {
    // console.error("Error fetching data:", err);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
};
