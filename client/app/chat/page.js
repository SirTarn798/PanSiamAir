"use client"

import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export default function Chat() {
  const id = useSelector((state) => state.user.id);
  const socket = io("ws://localhost:4000");
  socket.emit("register", id);

  const sendMsg = (e) => {
    e.preventDefault();
    const data = {
      message: "hello",
      sender: id,
      receiver: "e52ec850-2e3d-422b-99b4-5ae821c49d48"
    }
    socket.emit("sendMsg", data);
  }

  socket.on("receiveMsg", data => {
    console.log(data);
  })

  return(
    <div className="flex gap-20">
      <input type="text" placeholder="message"></input>
      <h1>xdd</h1>
      <button onClick={sendMsg} className="bg-white">Send</button>
    </div>
  )
}
