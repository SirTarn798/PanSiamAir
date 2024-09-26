export default function ChatBox(props) {
  return (
    <div
      className="flex gap-7 w-full p-3 cursor-pointer rounded hover:bg-primaryBg"
      onClick={props.onClick}
    >
      <img
        src={props.chat.user.profile}
        alt="profile picture"
        className="w-20 h-20 rounded-full"
      />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold">{props.chat.user.name}</p>
        <p>
          {props.chat.messages[props.chat.messages.length - 1].message
            ? props.chat.messages[props.chat.messages.length - 1].message
            : "ส่งรูปภาพ"}
        </p>
      </div>
    </div>
  );
}
