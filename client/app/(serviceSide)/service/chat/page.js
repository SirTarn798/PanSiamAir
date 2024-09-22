"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import ChatBox from "../../../component/chatBox";
import ChatPanel from "../../../component/chatPanel";

export default function Chat() {
  const id = useSelector((state) => state.user.id);

  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState();
  const [cusId, setCusId] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("ws://localhost:4000");
    setSocket(newSocket);

    //disconnect when unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []);

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

  useEffect(() => {
    if (!socket) return;
    socket.emit("serRegister", id);

    // Handle incoming messages, but ensure it's not being re-attached
    const handleMessage = (data) => {
      setChats((prevChats) => {
        const updatedChats = { ...prevChats };

        updatedChats[data.receiver].messages.push(data);

        return updatedChats;
      });
    };

    socket.on("receiveMsg", handleMessage);
    return () => {
      socket.off("receiveMsg", handleMessage);
    };
  }, [socket]);

  const sendMsg = (text) => {
    if (!socket) return;

    const data = {
      message: text,
      sender: "services",
      receiver: cusId,
      dateTime: new Date()
    };
    socket.emit("serSendMsg", data);
  };

  const handleClickChat = (userId) => {
    setChat(chats[userId]);
    setCusId(userId);
  };

  return (
    <div className="flex w-screen h-screen justify-center p-5">
      <div className="w-3/12 mr-3.5">
        <h2 className="font-extrabold text-3xl">รายการแชท</h2>
        {Object.entries(chats)?.map(([userId, chatData]) => {
          return (
            <ChatBox
              key={userId}
              chat={chatData}
              onClick={() => handleClickChat(userId)}
            />
          );
        })}
      </div>

      {cusId ? (
        <ChatPanel
          sendMsg={sendMsg}
          chat={chat}
          side={"services"}
          key={cusId}
        />
      ) : (
        <div className="w-full"></div>
      )}
    </div>
  );
}
