export default function ListAC(props) {
  let ac = props.ac;
  const status = {
    "สถานะปกติ" : "bg-primary"
  }
  return (
    <div className="grid grid-cols-5 grid-rows-1 p-3 items-center">
      <p>{ac.WC_Serial}</p>
      <p>{ac.WC_Model}</p>
      <p>{ac.WC_Address}</p>
      <p>สถานะประกัน</p>
      <p className={"rounded-lg w-fit p-2 cursor-pointer " + status[ac.WC_Status]}>{ac.WC_Status}</p>
    </div>
  );
}
