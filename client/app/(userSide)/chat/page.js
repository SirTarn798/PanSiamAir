"use client"

import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export default function Chat() {
  const id = useSelector((state) => state.user.id);
  const socket = io("ws://localhost:4000");
  socket.emit("cusRegister", id);

  const sendMsg = (e) => {
    e.preventDefault();
    const data = {
      message: "hello",
      sender: id,
    }
    socket.emit("cusSendMsg", data);
  }

  socket.on("receiveMsg", data => {
    console.log(data);
  })

  return(
    <div className="flex gap-20">
      <input type="text" placeholder="message"></input>
      <button onClick={sendMsg} className="bg-white">Send</button>
    </div>
  )
}
