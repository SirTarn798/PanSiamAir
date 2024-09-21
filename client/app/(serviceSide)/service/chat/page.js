"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import ChatBox from "../../../component/chatBox";
import ChatPanel from "../../../component/chatPanel"

export default function Chat() {
  const id = useSelector((state) => state.user.id);

  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState();
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
        console.log(data);
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Register user
    socket.emit("resRegister", id);

    // Handle incoming messages
    socket.on("receiveMsg", (data) => {
      //logic
    });

    // Cleanup on component unmount or socket change
    return () => {
      socket.off("receiveMsg");
    };
  }, [socket, id]);

  const sendMsg = (e) => {
    e.preventDefault();
    if (!socket) return;

    const data = {
      message: "hello",
      sender: "services",
    };
    socket.emit("serSendMsg", data);
  };

  return (
    <div className="flex w-screen h-screen justify-center p-5">
      <div className="w-3/12 mr-3.5">
        <h2 className="font-extrabold text-3xl">รายการแชท</h2>
        {Object.entries(chats)?.map(([userId, chatData]) => {
          return <ChatBox key={userId} chat={chatData} onClick={() => setChat(chatData)}/>;
        })}
      </div>

      <ChatPanel setText={sendMsg} chat={chat}/>
    </div>
  );
}
