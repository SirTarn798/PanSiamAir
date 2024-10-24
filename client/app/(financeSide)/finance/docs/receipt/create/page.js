"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateReceipt() {
  const searchParams = useSearchParams();
  const [request, setRequest] = useState();
  const [error, setError] = useState(null);
  const rf_id = searchParams.get("rf_id") || "";
  const router = useRouter();

  if (error) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center cursor-not-allowed">
        <p className="text-white bg-primary p-4">{"!! " + error + " !!"}</p>
      </div>
    );
  }
  if (request)
    return (
      <div className="w-screen flex flex-col items-center">
        
        <div className="flex flex-col rounded-t p-5 bg-primaryBg mt-1 mx-5 w-9/12 h-fit gap-5">
          <p className="font-bold text-4xl">
            หมายเลขเครื่อง {request.AC.AC_Serial}
          </p>
          <div className="grid grid-cols-2 grid-rows-5 gap-x-40 gap-y-5 w-fit">
            <p className="font-bold">ชื่อ - สกุล</p>
            <p>{request.AC.Customer.U_Name}</p>
            <p className="font-bold">รุ่น</p>
            <p>{request.AC.AC_Model}</p>
            <p className="font-bold">ที่อยู่</p>
            <p>{request.AC.AC_Address}</p>
            <p className="font-bold">ประกัน</p>
            <p
              className={
                "font-bold " +
                (insurance ? "text-emerald-600" : "text-rose-700")
              }
            >
              {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
            </p>
            <p className="font-bold">เบอร์โทร</p>
            <p>{request.AC.Customer.U_Tel}</p>
            <p className="font-bold">รายละเอียด</p>
            <p>{request.RP_Detail}</p>
          </div>
          {request.RP_Status === "waiting" ? 
            <div className="flex flex-col gap-2">
              <p className="font-bold">ประมาณเวลาซ่อม</p>
              <div className="flex gap-4">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  className="w-20 p-2 border rounded"
                  placeholder="นาที"
                  required
                />
              </div>
            </div>
          : null}
        </div>
        <div
          className="flex items-center justify-center bg-primary mx-5 rounded-b w-9/12 text-white font-bold h-14 text-2xl cursor-pointer"
          onClick={() =>
            router.push(`/service/chat?chatId=${request.AC.Customer.U_Id}`)
          }
        >
          <p>ไปที่แชท</p>
        </div>
      </div>
    );
}
