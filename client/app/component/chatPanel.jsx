import { useState } from "react";

export default function ChatPanel(props) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col bg-primaryBg rounded p-5 w-full">
      <div className="flex w-full justify-end p-3 bg-primary gap-6 items-center rounded-t">
        <img
          src={props.chat ? props.chat.user.profile : "/user.png"}
          alt="User"
          className="w-20 h-20 rounded-full"
        />
        <h1 className="text-white text-3xl font-bold">
          {props.chat ? props.chat.user.name : ""}
        </h1>
      </div>
      <div className="flex flex-col bg-white h-screen"></div>
      <div className="flex gap-5 w-full pt-5">
        <input
          type="text"
          placeholder="message"
          className="bg-white p-2 rounded w-full"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button
          onClick={props.sendMsg}
          className="p-2 px-5 rounded bg-primary text-white font-bold"
          value={text}
        >
          Send
        </button>
      </div>
    </div>
  );
}