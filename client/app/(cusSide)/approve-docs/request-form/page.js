"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import checkInsurance from "@/lib/checkInsurance";
import { useSelector } from "react-redux";

export default function ApproveReqiestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [request, setRequest] = useState({ AC: { Customer: "" } });
  const [error, setError] = useState(null);
  const [insurance, setInsurance] = useState(false);
  const serial = searchParams.get("serial") || "";
  const id = useSelector((state) => state.user.id);

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await fetch("/api/getRequestFormCusApprove", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            serial,
            id,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          setRequest(data.request);
          setInsurance(checkInsurance(data.request.AC_Installation_date));
        } else {
          throw new Error("ขออภัย มีข้อผิดพลาด");
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getRequest();
  }, [serial, id]);

  const approveRequestForm = async () => {
    const confirmProceed = window.confirm("ท่านแน่ใจหรือไม่ว่าต้องการยืนยัน");
    if (!confirmProceed) {
      return;
    }

    const statusAc = insurance
      ? "ซ่อมสำเร็จ รอกระบวนการเสร็จสิ้น"
      : "อัปโหลดหลักฐานการชำระเงิน";
    const statusRp = insurance
      ? "accepted_wait_write_receive_voucher"
      : "accepted_wait_upload_payment";

    try {
      const response = await fetch("/api/updateRequest", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          serial,
          id: request.RP_Id,
          statusAc,
          statusRp,
        }),
      });
      router.push("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col w-screen h-screen pl-16 pt-5 pr-3 items-center justify-center cursor-not-allowed">
        <p className="text-white bg-primary p-4">{"!! " + error + " !!"}</p>
      </div>
    );
  }
  return (
    <div className="w-screen flex flex-col items-center">
      <div className="flex flex-col rounded-t p-5 bg-primaryBg mt-1 mx-5 w-9/12 h-fit gap-5">
        <p className="font-bold text-4xl">หมายเลขเครื่อง {request.AC_Serial}</p>
        <div className="grid grid-cols-2 grid-rows-5 gap-x-40 gap-y-5 w-fit">
          <p className="font-bold">รุ่น</p>
          <p>{request.AC_Model}</p>
          <p className="font-bold">ที่อยู่</p>
          <p>{request.AC_Address}</p>
          <p className="font-bold">ประกัน</p>
          <p
            className={
              "font-bold " + (insurance ? "text-emerald-600" : "text-rose-700")
            }
          >
            {insurance ? "อยู่ในประกัน" : "ไม่อยู่ในประกัน"}
          </p>
        </div>
        <p className="font-bold text-2xl">สาเหตุ</p>
        <p className="w-8/12 h-32 rounded">{request.RF_Cause}</p>
        <p className="font-bold text-2xl">วิธีการซ่อม</p>
        <p className="w-8/12 h-32 rounded">{request.RF_Repair_details}</p>
        <div className="flex gap-10">
          <button
            className="bg-primary font-bold text-lg text-white w-fit p-3 rounded-3xl"
            onClick={approveRequestForm}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
