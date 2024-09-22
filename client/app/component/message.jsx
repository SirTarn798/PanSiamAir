import { formatDistance, subDays } from "date-fns";

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
        "flex flex-col gap-2 p-1.5 max-w-80 m-1.5 rounded " +
        (senderSelf
          ? "bg-primaryBg place-self-end"
          : "bg-red-200 place-self-start")
      }
    >
      {props.message.message ? <p className="text-black break-words">{props.message.message}</p> : <img src={props.message.image}/>}
      <p className="text-xs text-zinc-500">
        {formatDistance(new Date(props.message.dateTime), new Date(), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
}
