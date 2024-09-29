import { useRouter } from "next/navigation";
import checkInsurance from "@/lib/checkInsurance"

export default function ListAC(props) {
  let ac = props.ac;
  let insurance = checkInsurance(ac.AC_Installation_date);
  const router = useRouter();

  const handleFixRequest = () => {
    if (ac.AC_Status != "สถานะปกติ") {
      return;
    }
    router.push(`/fixing?serial=${ac.AC_Serial}`);
  };

  const status = {
    สถานะปกติ: "bg-primary cursor-pointer",
    รอพิจารณาซ่อม: "bg-black text-white cursor-not-allowed",
    รอยืนยันราคา: "bg-black text-white curor-pointer",
    รอเลือกวันนัดหมาย: "bg-black text-white cursor-pointer",
    อยู่ในขั้นตอนการซ่อม: "bg-black text-white cursor-not-allowed",
  };

  return (
    <div className="grid grid-cols-5 grid-rows-1 p-3 items-center">
      <p>{ac.AC_Serial}</p>
      <p>{ac.AC_Model}</p>
      <p>{ac.AC_Address}</p>
      <p className={"font-bold " + (insurance ? "text-emerald-600	" : "text-rose-700")}>{insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}</p>
      <p
        className={"rounded-lg w-fit p-2 " + status[ac.AC_Status]}
        onClick={handleFixRequest}
      >
        {ac.WC_Status === "สถานะปกติ" ? "แจ้งซ่อม" : ac.AC_Status}
      </p>
    </div>
  );
}
