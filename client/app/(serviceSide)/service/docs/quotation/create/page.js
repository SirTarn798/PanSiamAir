"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BackBtn from "@/app/component/backBtn";

export default function CreateQuotation() {
  const searchParams = useSearchParams();
  const RF_Id = searchParams.get("RF_Id");
  const [status, setStatus] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(1);
  const [rf, setRF] = useState(null);

  useEffect(() => {
    const checkRequestFormExistence = async () => {
      try {
        const response = await fetch("/api/checkRequestFormExistence", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            RF_Id,
          }),
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log(data.rf)
          setRF(data.rf);
          setStatus(true);
        } else {
          throw new Error("ขออภัย หมายเลขใบขอรับบริการไม่ถูกต้อง");
        }
      } catch (error) {
        setStatus(false);
      }
    };
    checkRequestFormExistence();
  }, []);

  if (status === true) {
    return (
      <div className="flex flex-col w-screen p-16 bg-primaryBg m-10 rounded-3xl">
        <div className="flex flex-col gap-3 font-bold">
            <p>ชื่อ - นามสกุล : {rf.Request_problem.AC.Customer.U_Name}</p>
            <p>ที่อยู่ : {rf.Request_problem.AC.AC_Address}</p>
            <p>รหัสใบขอรับบริการ : {rf.RF_Id}</p>
            <p>หมายเลขเครื่อง : {rf.Request_problem.AC.AC_Serial}</p>
            <p>รุ่น : {rf.Request_problem.AC.AC_Model}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-screen w-screen justify-center items-center cursor-not-allowed">
        <p className="text-white bg-primary p-4 font-bold">
          ข้อมูล ID ใน URL ไม่ถูกต้อง
        </p>
      </div>
    );
  }
}
