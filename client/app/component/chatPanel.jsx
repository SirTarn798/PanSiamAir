import { useState, useEffect, useRef } from "react";
import Message from "@/app/component/message";
import upload from "@/lib/upload";

export default function ChatPanel(props) {
  console.log(props)
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const [pic, setPic] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    scrollToBottom();
  }, [props]); // Scroll when messages change

  const sendMsg = () => {
    if (text.trim()) {
      props.sendMsg(text);
      setText("");
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];

      setPic({
        file: selectedFile,
        url: URL.createObjectURL(selectedFile),
      });

      try {
        const imgLink = await upload(selectedFile, "chats");

        if (imgLink) {
          props.sendPic(imgLink);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div className="flex flex-col bg-primaryBg rounded p-5 w-full">
      <div className="flex w-full justify-end p-3 bg-primary gap-6 items-center rounded-t">
        <img
          src={props.side === "customer" ? "/user.png" : props.chat.user.profile}
          alt="User"
          className="w-20 h-20 rounded-full"
        />
        <h1 className="text-white text-3xl font-bold">
          {props.side === "customer" ? "Admin" : props.chat.user.name}
        </h1>
      </div>
      <div className="flex flex-col bg-white h-screen gap-1 overflow-scroll overflow-x-hidden">
        {props.chat?.messages.map((message) => {
          return (
            <Message
              message={message}
              side={props.side}
              key={message.M_Id}
              id={props.side === "services" ? "" : props.id}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-5 w-full pt-5">
        <input
          type="text"
          placeholder="message"
          className="bg-white p-2 rounded w-full"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
        />
        <img
          src="/photo.png"
          alt="upload photo"
          className="h-10 cursor-pointer"
          onClick={() => {
            document.getElementById("fileInput").click();
          }}
        />
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          onClick={sendMsg}
          className="p-2 px-5 rounded bg-primary text-white font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
