import { useRouter } from "next/navigation";

export default function ListAC(props) {
  let ac = props.ac;

  const router = useRouter();

  const handleFixRequest = () => {
    if(ac.WC_Status != "สถานะปกติ") {
      return;
    }
    router.push(`/fixing?serial=${ac.WC_Serial}`)
  }

  const status = {
    สถานะปกติ: "bg-primary cursor-pointer",
    รอพิจารณาซ่อม: "bg-primaryBg",
    รอยืนยันราคา: "bg-primaryBg",
    รอเลือกวันซ่อม: "bg-primaryBg",
    อยู่ในขั้นตอนการซ่อม: "bg-primaryBg",
  };
  return (
    <div className="grid grid-cols-5 grid-rows-1 p-3 items-center">
      <p>{ac.WC_Serial}</p>
      <p>{ac.WC_Model}</p>
      <p>{ac.WC_Address}</p>
      <p>สถานะประกัน</p>
      <p
        className={
          "rounded-lg w-fit p-2 " + status[ac.WC_Status]
        }
        onClick={handleFixRequest}
      >
        {ac.WC_Status}
      </p>
    </div>
  );
}
