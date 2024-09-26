import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const messages = await prisma.mESSAGE.findMany();

    // Step 1: Group messages by userId (sender and receiver), skipping "x"
    const groupedMessages = messages.reduce((acc, message) => {
      // Add messages where the user is the sender (but skip if sender is "x")
      if (message.M_Sender !== "x") {
        if (!acc[message.M_Sender]) {
          acc[message.M_Sender] = [];
        }
        acc[message.M_Sender].push(message);
      }

      // Add messages where the user is the receiver (but skip if receiver is "x")
      if (message.M_Receiver !== "x") {
        if (!acc[message.M_Receiver]) {
          acc[message.M_Receiver] = [];
        }
        acc[message.M_Receiver].push(message);
      }

      return acc;
    }, {});

    // Step 2: Fetch user details (name and profile URL) for all userIds in groupedMessages
    const userIds = Object.keys(groupedMessages);

    const users = await prisma.uSER.findMany({
      where: { U_Id: { in: userIds } }, // Fetch users whose id is in userIds
      select: {
        U_Id: true,
        U_Name: true,
        U_Profile: true,
      },
    });

    // Step 3: Enhance groupedMessages with user details (name and profile_url)
    const result = userIds.reduce((acc, userId) => {
      const user = users.find((u) => u.U_Id === userId);
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
    console.error("Error fetching data:", err);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
};