export default function ChatBox(props) {
  return (
    <div
      className="flex gap-7 w-full p-3 cursor-pointer rounded hover:bg-primaryBg truncate text-ellipsis"
      onClick={props.onClick}
    >
      <img
        src={props.chat.user.profile}
        alt="profile picture"
        className="w-20 h-20 rounded-full"
      />
      <div className="flex flex-col gap-1 w-full m=">
        <p className="text-lg font-bold">{props.chat.user.name}</p>
        <p className="max-w-full text-gray-600">
          {props.chat.messages[props.chat.messages.length - 1].M_Message
            ? props.chat.messages[props.chat.messages.length - 1].M_Message
            : "ส่งรูปภาพ"}
        </p>
      </div>
    </div>
  );
}
