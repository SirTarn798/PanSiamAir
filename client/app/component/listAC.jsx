export default function ListAC(props) {
  return (
    <div className="grid grid-cols-6 grid-rows-1 border-solid border-b-2 border-black p-3">
      <p>{props.serial}</p>
      <p>{props.model}</p>
      <p>{props.address}</p>
      <p>สถานะประกัน</p>
      <p>สถานะการซ่อม</p>
      <p></p>
    </div>
  );
}
