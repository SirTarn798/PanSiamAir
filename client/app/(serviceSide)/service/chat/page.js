"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import ChatBox from "../../../component/chatBox";
import ChatPanel from "../../../component/chatPanel";
import { useSearchParams, useRouter } from "next/navigation";

export default function Chat() {
  const id = useSelector((state) => state.user.id);
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get("chatId");

  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [cusId, setCusId] = useState(chatId);
  const [socket, setSocket] = useState(null);
  const [cus, setCus] = useState(null);

  // Set up socket connection
  useEffect(() => {
    const newSocket = io("ws://localhost:4000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/getChats");
        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  // Register socket for current user and handle incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.emit("serRegister", id);

    const handleMessage = (data) => {
      setChats((prevChats) => {
        const updatedChats = { ...prevChats };
        if (data.M_Sender !== "services") {
          updatedChats[data.M_Sender]?.messages.push(data);
        } else {
          updatedChats[data.M_Receiver]?.messages.push(data);
        }

        return updatedChats;
      });
    };

    socket.on("receiveMsg", handleMessage);

    return () => {
      socket.off("receiveMsg", handleMessage);
    };
  }, [socket]);

  // Update chat and cusId when chatId changes
  useEffect(() => {
    if (chatId) {
      setChat(chats[chatId]);
    }
  }, [chats, chatId]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/getCusById", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            cusId,
          }),
        });
        const data = await response.json();
        setCus(data.user);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    getUser();
  }, [cusId]);

  // Handle sending a message
  const sendMsg = (text) => {
    if (!socket || !cusId) return;
    const data = {
      M_Message: text,
      M_Sender: "services",
      M_Receiver: cusId,
      M_DateTime: new Date(),
    };
    socket.emit("serSendMsg", data);
  };

  // Handle sending a picture
  const sendPic = (picLink) => {
    if (!socket || !cusId) return;

    const data = {
      M_Image: picLink,
      M_Sender: "services",
      M_Receiver: cusId,
      M_DateTime: new Date(),
    };
    socket.emit("serSendMsg", data);
  };

  // Handle chat selection
  const handleClickChat = (userId) => {
    setChat(chats[userId]);
    setCusId(userId);
    router.push(`/service/chat?chatId=${userId}`);
  };

  return (
    <div className="flex w-screen h-screen justify-center p-5">
      <div className="w-3/12 mr-2.5">
        <h2 className="font-extrabold text-3xl">รายการแชท</h2>
        <div className="overflow-scroll overflow-x-hidden h-full">
          {Object.entries(chats)?.map(([userId, chatData]) => (
            <ChatBox
              key={userId}
              chat={chatData}
              onClick={() => handleClickChat(userId)}
            />
          ))}
        </div>
      </div>
      {cus ? (
        <ChatPanel
          sendMsg={sendMsg}
          sendPic={sendPic}
          chat={chat}
          side={"services"}
          key={cusId}
          user={cus}
        />
      ) : (
        <div className="flex h-full w-full justify-center items-center cursor-not-allowed">
          <p className="text-white bg-primary p-4">ข้อมูล ID ใน URL ไม่ถูกต้องหรือกดเลือกที่แชท</p>
        </div>
      )}
    </div>
  );
}
