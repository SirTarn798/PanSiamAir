"use client";

import checkInsurance from "@/lib/checkInsurance";
import { useRouter } from "next/navigation";

export default function Request(props) {
  let insurance = checkInsurance(props.request.AC.AC_Installation_date);
  const router = useRouter();

  return (
    <div className="flex flex-col bg-primaryBg rounded p-5 w-8/12">
      <div className="grid grid-cols-4 grid-rows-3 gap-3">
        <p className="font-bold">หมายเลขเครื่อง</p>
        <p>{props.request.AC_Serial}</p>
        <p className="font-bold">ชื่อ - สกุล</p>
        <p>{props.request.AC.Customer.U_Name}</p>
        <p className="font-bold">รุ่น</p>
        <p>{props.request.AC.AC_Model}</p>
        <p className="font-bold">ที่อยู่</p>
        <p>{props.request.AC.AC_Address}</p>
        <p className="font-bold">ประกัน</p>
        <p
          className={
            "font-bold " + (insurance ? "text-emerald-600" : "text-rose-700")
          }
        >
          {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
        </p>
        <p className="font-bold">เบอร์โทร</p>
        <p>{props.request.AC.Customer.U_Tel}</p>
      </div>
      <p
        className="mt-10 p-3 bg-primary rounded-full w-fit justify-end self-end font-bold cursor-pointer"
        onClick={() => {router.push(`/service/request?id=${props.request.RP_Id}`)}}
      >
        ดูรายละเอียด
      </p>
    </div>
  );
}
