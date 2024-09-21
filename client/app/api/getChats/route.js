import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const messages = await prisma.message.findMany();

    // Step 1: Group messages by userId (sender and receiver), skipping "x"
    const groupedMessages = messages.reduce((acc, message) => {
      // Add messages where the user is the sender (but skip if sender is "x")
      if (message.sender !== "x") {
        if (!acc[message.sender]) {
          acc[message.sender] = [];
        }
        acc[message.sender].push(message);
      }

      // Add messages where the user is the receiver (but skip if receiver is "x")
      if (message.receiver !== "x") {
        if (!acc[message.receiver]) {
          acc[message.receiver] = [];
        }
        acc[message.receiver].push(message);
      }

      return acc;
    }, {});

    // Step 2: Fetch user details (name and profile URL) for all userIds in groupedMessages
    const userIds = Object.keys(groupedMessages);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } }, // Fetch users whose id is in userIds
      select: {
        id: true,
        name: true,
        profile: true,
      },
    });

    // Step 3: Enhance groupedMessages with user details (name and profile_url)
    const result = userIds.reduce((acc, userId) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
        acc[userId] = {
          user: {
            name: user.name,
            profile: user.profile,
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