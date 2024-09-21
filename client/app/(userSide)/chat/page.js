"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export default function Chat() {
  const id = useSelector((state) => state.user.id);
  const [msg, setMsg] = useState([]);
  const [socket, setSocket] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const newSocket = io("ws://localhost:4000");
    setSocket(newSocket);

    //disconnect when unmounted
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
      console.log(data);
      setMsg((prevMsgs) => [...prevMsgs, data]);
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
      message: text,
      sender: id,
    };
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
      setMsg(data);
    };
    fetchMessages();
  }, [id]);

  return (
    <div className="flex w-screen h-screen justify-center p-5">
      <div className="flex flex-col bg-primaryBg rounded p-5 w-full">
        <div className="flex w-full justify-end p-3 bg-primary gap-6 items-center rounded-t">
          <img src="/user.png" height={50} width={50} alt="User" />
          <h1 className="text-white text-3xl font-bold">ADMIN</h1>
        </div>
        <div className="h-full bg-white">{/* {msg.map(message)} */}</div>
        <div className="flex gap-5 w-full pt-5">
          <input
            type="text"
            placeholder="message"
            className="bg-white p-2 rounded w-full"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <button
            onClick={sendMsg}
            className="p-2 px-5 rounded bg-primary text-white font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
