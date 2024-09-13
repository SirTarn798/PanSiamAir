export default function ListAC(props) {
  let ac = props.ac;
  console.log(ac)
  return (
    <div className="grid grid-cols-6 grid-rows-1 p-3">
      <p>{ac.WC_Serial}</p>
      <p>{ac.WC_Model}</p>
      <p>{ac.WC_Address}</p>
      <p>สถานะประกัน</p>
      <p>สถานะการซ่อม</p>
      <p></p>
    </div>
  );
}
