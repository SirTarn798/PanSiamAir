export default function Message(props) {
  let senderSelf;
  if (props.side === "services" && props.message.sender === "services") {
    senderSelf = true;
  } else if (props.side === "cus" && props.message.sender === props.id) {
    senderSelf = true;
  } else {
    senderSelf = false;
  }
  return (
    <div
      className={
        "p-1.5 max-w-80 m-1.5 rounded " +
        (senderSelf ? "bg-black" : "bg-red-400")
      }
    >
      <p className="text-white">{props.message.message}</p>
    </div>
  );
}
