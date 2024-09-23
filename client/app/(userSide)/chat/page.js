"use client";

import ChatPanel from "@/app/component/chatPanel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export default function Chat() {
  const id = useSelector((state) => state.user.id);
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState({ messages: [] }); // Initialize chat with empty messages

  useEffect(() => {
    const newSocket = io("ws://localhost:4000");
    setSocket(newSocket);

    // Disconnect when unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Register user
    socket.emit("cusRegister", id);

    // Handle incoming messages
    socket.on("receiveMsg", (data) => {
      setChat((prevChat) => {
        const updatedChat = { ...prevChat, messages: [...prevChat.messages, data] };
        return updatedChat;
      });
    });

    // Cleanup on component unmount or socket change
    return () => {
      socket.off("receiveMsg");
    };
  }, [socket, id]);

  const sendMsg = (text) => {
    if (!socket) return;

    const data = {
      message: text,
      sender: id,
      receiver: "services",
      dateTime: new Date(),
    };

    // Update chat with new message
    setChat((prevChat) => {
      const updatedChat = { ...prevChat, messages: [...prevChat.messages, data] };
      return updatedChat;
    });

    socket.emit("cusSendMsg", data);
  };

  const sendPic = (picLink) => {
    if (!socket) return;

    const data = {
      image: picLink,
      sender: id,
      receiver: "services",
      dateTime: new Date(),
    };

    setChat((prevChat) => {
      const updatedChat = { ...prevChat, messages: [...prevChat.messages, data] };
      return updatedChat;
    });

    socket.emit("cusSendMsg", data);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch("/api/getMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();
      setChat(data);
    };
    fetchMessages();
  }, [id]);

  return (
    <div className="flex w-screen h-screen justify-center p-5">
      <ChatPanel
        sendMsg={sendMsg}
        sendPic={sendPic}
        chat={chat}
        side={"customer"}
        id={id}
        key={id}
      />
    </div>
  );
}
