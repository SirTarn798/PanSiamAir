import { useRouter } from "next/navigation";
import checkInsurance from "@/lib/checkInsurance";

export default function ListAC(props) {
  let ac = props.ac;
  let insurance = checkInsurance(ac.AC_Installation_date);
  const router = useRouter();

  const handleFixRequest = () => {
    if (ac.AC_Status === "สถานะปกติ") {
      router.push(`/fixing?serial=${ac.AC_Serial}`);
      return;
    } else if (ac.AC_Status === "รอยืนยันราคา") {
      router.push(`/approve-docs/quotation?serial=${ac.AC_Serial}`);
      return;
    } else if (ac.AC_Status === "รอเลือกวันนัดหมาย") {
      router.push(`/pick-calendar?serial=${ac.AC_Serial}`);
    } else if (ac.AC_Status === "รอการเลือกวันใหม่อีกครั้ง") {
      router.push(`/pick-calendar?serial=${ac.AC_Serial}&reschedule=true`);
    } else if (ac.AC_Status === "รอยืนยันใบขอรับบริการ") {
      router.push(`/approve-docs/request-form?serial=${ac.AC_Serial}&reschedule=true`);
    }
  };

  const status = {
    สถานะปกติ: "bg-primary cursor-pointer",
    รอพิจารณาซ่อม: "bg-black text-white cursor-not-allowed",
    รอทางบริษัทเสนอราคา: "bg-black text-white cursor-not-allowed",
    รอยืนยันราคา: "bg-black text-white cursor-pointer",
    รอเลือกวันนัดหมาย: "bg-black text-white cursor-pointer",
    อยู่ในขั้นตอนการซ่อม: "bg-black text-white cursor-not-allowed",
    รอการเลือกวันใหม่อีกครั้ง: "bg-black text-white cursor-pointer",
    รอยืนยันใบขอรับบริการ: "bg-black text-white cursor-pointer",
    "ซ่อมสำเร็จ รอกระบวนการเสร็จสิ้น": "bg-black text-white cursor-not-allowed",
  };

  return (
    <div className="grid grid-cols-5 grid-rows-1 p-3 items-center">
      <p>{ac.AC_Serial}</p>
      <p>{ac.AC_Model}</p>
      <p>{ac.AC_Address}</p>
      <p
        className={
          "font-bold " + (insurance ? "text-emerald-600	" : "text-rose-700")
        }
      >
        {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
      </p>
      <p
        className={"rounded-lg w-fit p-2 " + status[ac.AC_Status]}
        onClick={handleFixRequest}
      >
        {ac.WC_Status === "สถานะปกติ" ? "แจ้งซ่อม" : ac.AC_Status}
      </p>
    </div>
  );
}
